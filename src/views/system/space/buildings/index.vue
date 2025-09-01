<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="所属工区" prop="zoneId">
              <el-select v-model="queryParams.zoneId" placeholder="请选择所属工区" clearable>
                <el-option v-for="zone in zonesOptions" :key="zone.id" :label="zone.zoneName" :value="zone.id" />
              </el-select>
            </el-form-item>
            <el-form-item label="楼栋名称" prop="buildingName">
              <el-input v-model="queryParams.buildingName" placeholder="请输入楼栋名称" clearable @keyup.enter="handleQuery" />
            </el-form-item>
            <el-form-item label="该楼栋总楼层数" prop="floorCount">
              <el-input-number
                v-model="queryParams.floorCount"
                placeholder="请输入楼层数"
                controls-position="right"
                clearable
                @keyup.enter="handleQuery"
              />
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
            <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:buildings:add']">新增</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()" v-hasPermi="['system:buildings:edit']"
              >修改</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()" v-hasPermi="['system:buildings:remove']"
              >删除</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="warning" plain icon="Download" @click="handleExport" v-hasPermi="['system:buildings:export']">导出</el-button>
          </el-col>
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" border :data="buildingsList" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="主键" align="center" prop="id" v-if="true" />
        <el-table-column label="所属工区" align="center" prop="zoneId">
          <template #default="scope">
            <el-tag type="success">
              {{
                zonesOptions.find(z => z.id === scope.row.zoneId)?.zoneName || '-'
              }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="楼栋名称" align="center" prop="buildingName" />
        <el-table-column label="该楼栋总楼层数" align="center" prop="floorCount" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)" v-hasPermi="['system:buildings:edit']"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:buildings:remove']"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum" v-model:limit="queryParams.pageSize" @pagination="getList" />
    </el-card>
    <!-- 添加或修改楼栋信息对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="buildingsFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="所属工区" prop="zoneId">
          <el-select v-model="form.zoneId" placeholder="请选择所属工区" clearable>
            <el-option v-for="zone in zonesOptions" :key="zone.id" :label="zone.zoneName" :value="zone.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="楼栋名称" prop="buildingName">
          <el-input v-model="form.buildingName" placeholder="请输入楼栋名称" />
        </el-form-item>
        <el-form-item label="该楼栋总楼层数" prop="floorCount">
          <el-input-number
            v-model="form.floorCount"
            placeholder="请输入楼层数"
            @keyup.enter.native="handleQuery"
            controls-position="right"
            clearable
          />
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

<script setup name="Buildings" lang="ts">
import { listBuildings, getBuildings, delBuildings, addBuildings, updateBuildings } from '@/api/system/space/buildings';
import { BuildingsVO, BuildingsQuery, BuildingsForm } from '@/api/system/space/buildings/types';
import { ZonesVO } from '@/api/system/space/zones/types';
import { listZones } from '@/api/system/space/zones';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const buildingsList = ref<BuildingsVO[]>([]);
const zonesOptions = ref<ZonesVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const buildingsFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: BuildingsForm = {
  id: undefined,
  zoneId: undefined,
  buildingName: undefined,
  floorCount: undefined
};
const data = reactive<PageData<BuildingsForm, BuildingsQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    zoneId: undefined,
    buildingName: undefined,
    floorCount: undefined,
    params: {}
  },
  rules: {
    id: [{ required: true, message: '主键不能为空', trigger: 'blur' }],
    buildingName: [{ required: true, message: '楼栋名称不能为空', trigger: 'blur' }]
  }
});

const { queryParams, form, rules } = toRefs(data);

/** 查询楼栋信息列表 */
const getList = async () => {
  loading.value = true;
  const res = await listBuildings(queryParams.value);
  buildingsList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  buildingsFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: BuildingsVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = '添加楼栋信息';
};

/** 修改按钮操作 */
const handleUpdate = async (row?: BuildingsVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getBuildings(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = '修改楼栋信息';
};

/** 提交按钮 */
const submitForm = () => {
  buildingsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateBuildings(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addBuildings(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess('操作成功');
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: BuildingsVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除楼栋信息编号为"' + _ids + '"的数据项？').finally(() => (loading.value = false));
  await delBuildings(_ids);
  proxy?.$modal.msgSuccess('删除成功');
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    'system/buildings/export',
    {
      ...queryParams.value
    },
    `buildings_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
  getZones();
});

/** 查询部门下拉树结构 */
const getZones = async () => {
  const res = await listZones();
  zonesOptions.value = res.rows;
};
</script>
