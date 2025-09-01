<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="工区所在城市名称" prop="city">
              <el-input v-model="queryParams.city" placeholder="请输入工区所在城市名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="工区具体名称" prop="zoneName">
              <el-input v-model="queryParams.zoneName" placeholder="请输入工区具体名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="工区详细地址信息" prop="address">
              <el-input v-model="queryParams.address" placeholder="请输入工区详细地址信息" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
              <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:zones:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:zones:edit']">修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:zones:remove']">删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:zones:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="zonesList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="工区所在城市名称" align="center" prop="city" />
        <el-table-column label="工区具体名称" align="center" prop="zoneName" />
        <el-table-column label="工区详细地址信息" align="center" prop="address" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:zones:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:zones:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改城市工区信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="zonesFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="工区所在城市名称" prop="city">
          <el-input v-model="form.city" placeholder="请输入工区所在城市名称" />
        </el-form-item>
        <el-form-item label="工区具体名称" prop="zoneName">
          <el-input v-model="form.zoneName" placeholder="请输入工区具体名称" />
        </el-form-item>
        <el-form-item label="工区详细地址信息" prop="address">
          <el-input v-model="form.address" placeholder="请输入工区详细地址信息" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Zones" lang="ts">
import { listZones, getZones, delZones, addZones, updateZones } from '@/api/system/space/zones';
import { ZonesVO, ZonesQuery, ZonesForm } from '@/api/system/space/zones/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const zonesList = ref<ZonesVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const zonesFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: ZonesForm = {
  id: undefined,
  city: undefined,
  zoneName: undefined,
  address: undefined,
}
const data = reactive<PageData<ZonesForm, ZonesQuery>>({
  form: {...initFormData},
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    city: undefined,
    zoneName: undefined,
    address: undefined,
    params: {
    }
  },
  rules: {
    id: [
      { required: true, message: "主键不能为空", trigger: "blur" }
    ],
    city: [
      { required: true, message: "工区所在城市名称不能为空", trigger: "blur" }
    ],
    zoneName: [
      { required: true, message: "工区具体名称不能为空", trigger: "blur" }
    ],
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询城市工区信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listZones(queryParams.value);
  zonesList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  zonesFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: ZonesVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加城市工区信息";
}

/** 修改按钮操作 */
const handleUpdate = async (row?: ZonesVO) => {
  reset();
  const _id = row?.id || ids.value[0]
  const res = await getZones(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改城市工区信息";
}

/** 提交按钮 */
const submitForm = () => {
  zonesFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateZones(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addZones(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: ZonesVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除城市工区信息编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
  await delZones(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('system/zones/export', {
    ...queryParams.value
  }, `zones_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
