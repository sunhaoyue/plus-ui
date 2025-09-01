<template>
  <div class="p-2">
    <el-row :gutter="20">
      <!-- 空间工区树 -->
      <el-col :lg="4" :xs="24" style="">
        <el-card shadow="hover">
          <el-input
            v-model="spaceName"
            placeholder="请输入空间工区名称"
            prefix-icon="Search"
            clearable
          />
          <el-tree
            ref="spaceTreeRef"
            class="mt-2"
            node-key="id"
            :data="spaceOptions"
            :props="{ label: 'label', children: 'children' } as any"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            highlight-current
            default-expand-all
            @node-click="handleNodeClick"
          />
        </el-card>
      </el-col>
      <el-col :lg="20" :xs="24">
        <transition
          :enter-active-class="proxy?.animate.searchAnimate.enter"
          :leave-active-class="proxy?.animate.searchAnimate.leave"
        >
          <div v-show="showSearch" class="mb-[10px]">
            <el-card shadow="hover">
              <el-form ref="queryFormRef" :model="queryParams" :inline="true">
                <el-form-item label="工位编码" prop="workstationCode">
                  <el-input
                    v-model="queryParams.workstationCode"
                    placeholder="请输入工位唯一业务编码"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="工位名称(可选)" prop="workstationName">
                  <el-input
                    v-model="queryParams.workstationName"
                    placeholder="请输入工位名称(可选)"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
                <!-- <el-form-item label="所属空间" prop="spaceId">
                  <el-input
                    v-model="queryParams.spaceId"
                    placeholder="请输入所属空间"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item> -->
                <el-form-item label="工位状态" prop="status">
                  <el-select
                    v-model="queryParams.status"
                    placeholder="请选择工位状态"
                    clearable
                  >
                    <el-option
                      v-for="dict in space_status"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="使用类型" prop="usageType">
                  <el-select
                    v-model="queryParams.usageType"
                    placeholder="请选择使用类型"
                    clearable
                  >
                    <el-option
                      v-for="dict in space_usage_type"
                      :key="dict.value"
                      :label="dict.label"
                      :value="dict.value"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" icon="Search" @click="handleQuery"
                    >搜索</el-button
                  >
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
                <el-button
                  type="primary"
                  plain
                  icon="Plus"
                  @click="handleAdd"
                  v-hasPermi="['system:workstations:add']"
                  >新增</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="success"
                  plain
                  icon="Edit"
                  :disabled="single"
                  @click="handleUpdate()"
                  v-hasPermi="['system:workstations:edit']"
                  >修改</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="danger"
                  plain
                  icon="Delete"
                  :disabled="multiple"
                  @click="handleDelete()"
                  v-hasPermi="['system:workstations:remove']"
                  >删除</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="warning"
                  plain
                  icon="Download"
                  @click="handleExport"
                  v-hasPermi="['system:workstations:export']"
                  >导出</el-button
                >
              </el-col>
              <right-toolbar
                v-model:showSearch="showSearch"
                @queryTable="getList"
              ></right-toolbar>
            </el-row>
          </template>

          <el-table
            v-loading="loading"
            border
            :data="workstationsList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="主键" align="center" prop="id" v-if="true" />
            <el-table-column
              label="工位编码"
              align="center"
              prop="workstationCode"
            />
            <el-table-column
              label="工位名称(可选)"
              align="center"
              prop="workstationName"
            />
            <el-table-column label="所属空间" align="center" prop="spaceId">
              <template #default="scope">
                <el-tag type="success">
                  {{ idLabelMap.get(scope.row.spaceId) || "-" }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column label="工位所在楼层" align="center" prop="floor" />
            <el-table-column label="工位状态" align="center" prop="status">
              <template #default="scope">
                <dict-tag :options="space_status" :value="scope.row.status" />
              </template>
            </el-table-column>
            <el-table-column label="使用类型" align="center" prop="usageType">
              <template #default="scope">
                <dict-tag :options="space_usage_type" :value="scope.row.usageType" />
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-tooltip v-if="scope.row.status === 0" content="分配" placement="top">
                  <el-button
                    link
                    type="primary"
                    icon="User"
                    @click="handleAllocation(scope.row)"
                    v-hasPermi="['system:workstations:edit']"
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="修改" placement="top">
                  <el-button
                    link
                    type="primary"
                    icon="Edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:workstations:edit']"
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button
                    link
                    type="primary"
                    icon="Delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:workstations:remove']"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-show="total > 0"
            :total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="getList"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 添加或修改工位主对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
    >
      <el-form ref="workstationsFormRef" :model="form" :rules="rules" label-width="110px">
        <el-form-item label="工位编码" prop="workstationCode">
          <el-input v-model="form.workstationCode" placeholder="请输入工位唯一业务编码" />
        </el-form-item>
        <el-form-item label="工位名称(可选)" prop="workstationName">
          <el-input v-model="form.workstationName" placeholder="请输入工位名称(可选)" />
        </el-form-item>
        <el-form-item label="所属空间" prop="spaceId">
          <el-tree-select
            v-model="form.spaceId"
            :data="spaceOptions"
            :props="{ value: 'id', label: 'label', children: 'children' } as any"
            value-key="id"
            placeholder="请选择所属空间"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="工位所在楼层" prop="floor">
          <el-input-number
            v-model="form.floor"
            placeholder="请输入楼层数"
            controls-position="right"
            clearable
            @keyup.enter="handleQuery"
          />
        </el-form-item>
        <el-form-item label="工位状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in space_status"
              :key="dict.value"
              :value="parseInt(dict.value)"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="使用类型" prop="usageType">
          <el-select v-model="form.usageType" placeholder="请选择使用类型">
            <el-option
              v-for="dict in space_usage_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm"
            >确 定</el-button
          >
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 分配工位主对话框 -->
    <el-dialog
      :title="dialogAllocation.title"
      v-model="dialogAllocation.visible"
      width="500px"
      append-to-body
    >

      <el-form ref="workstationUsageFormRef" :model="form" :rules="rules" label-width="120px">

        <el-form-item label="使用员工" prop="userId">
          <select-allocation-user  ref="selectUserRef" />
          <el-input v-model="form.createTime" placeholder="点击选择用户"
          v-hasPermi="['system:workstations:edit']"
          @click="openSelectUser"
          />
        </el-form-item>

        <el-form-item label="使用开始时间" prop="startTime" >
          <el-date-picker
            clearable
            v-model="form.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择使用开始时间"
            :style="{ width: '300px' }"
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用结束时间" prop="endTime" >
          <el-date-picker
            clearable
            v-model="form.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择使用结束时间(NULL表示长期使用)"
            :style="{ width: '300px' }"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用类型" prop="usageType">
          <el-select v-model="form.usageType" placeholder="请选择使用类型">
            <el-option
              v-for="dict in space_usage_type"
              :key="dict.value"
              :label="dict.label"
              :value="parseInt(dict.value)"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitAllocationForm"
            >确 定</el-button
          >
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="Workstations" lang="ts">
import {
  listWorkstations,
  getWorkstations,
  delWorkstations,
  addWorkstations,
  updateWorkstations,
} from "@/api/system/space/workstations";
import {
  WorkstationsVO,
  WorkstationsQuery,
  WorkstationsForm,
} from "@/api/system/space/workstations/types";

import { spaceTreeSelect, getTree, flattenTreeToMap } from "@/api/system/space/tree";
import { TreeVO, TreeQuery, TreeForm } from "@/api/system/space/tree/types";


import SelectAllocationUser from '../selectAllocationUser.vue';
import {
  listWorkstationUsage,
  getWorkstationUsage,
  delWorkstationUsage,
  addWorkstationUsage,
  updateWorkstationUsage,
} from "@/api/system/space/workstationUsage";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { space_usage_type, space_status } = toRefs<any>(
  proxy?.useDict("space_usage_type", "space_status")
);

const workstationsList = ref<WorkstationsVO[]>([]);

const spaceOptions = ref<TreeVO[]>([]);
// 这里用一个 ref 保存映射表，方便异步赋值
const idLabelMap = ref(new Map());
const spaceName = ref("");

const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const spaceTreeRef = ref<ElTreeInstance>();
const queryFormRef = ref<ElFormInstance>();
const workstationsFormRef = ref<ElFormInstance>();
const workstationUsageFormRef = ref<ElFormInstance>();


const selectUserRef = ref<InstanceType<typeof SelectAllocationUser>>();


const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const dialogAllocation = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: WorkstationsForm = {
  id: undefined,
  workstationCode: undefined,
  workstationName: undefined,
  spaceId: undefined,
  floor: undefined,
  status: undefined,
  usageType: undefined,
};
const data = reactive<PageData<WorkstationsForm, WorkstationsQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    workstationCode: undefined,
    workstationName: undefined,
    spaceId: undefined,
    floor: undefined,
    status: undefined,
    usageType: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "主键不能为空", trigger: "blur" }],
    workstationCode: [
      { required: true, message: "工位唯一业务编码不能为空", trigger: "blur" },
    ],
    spaceId: [{ required: true, message: "所属空间为必选", trigger: "blur" }],
    status: [{ required: true, message: "工位状态为必选", trigger: "blur" }],
    usageType: [{ required: true, message: "使用类型为必选", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 通过条件过滤节点  */

/** 根据名称筛选空间区域树 */
watchEffect(
  () => {
    spaceTreeRef.value?.filter(spaceName.value);
  },
  {
    flush: "post", // watchEffect会在DOM挂载或者更新之前就会触发，此属性控制在DOM元素更新后运行
  }
);

/** 查询工位主列表 */
const getList = async () => {
  loading.value = true;
  const res = await listWorkstations(queryParams.value);
  workstationsList.value = res.rows;
  total.value = res.total;
  loading.value = false;
};

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
  dialogAllocation.visible = false;
};

/** 表单重置 */
const reset = () => {
  form.value = { ...initFormData };
  workstationsFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.value.spaceId = undefined;
  spaceTreeRef.value?.setCurrentKey(undefined);
  handleQuery();
};

/** 多选框选中数据 */
const handleSelectionChange = (selection: WorkstationsVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加工位主";
};

/** 分配按钮操作 */
const handleAllocation = async (row?: WorkstationsVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getWorkstations(_id);
  Object.assign(form.value, res.data);
  dialogAllocation.visible = true;
  dialogAllocation.title = "分配工位";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: WorkstationsVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getWorkstations(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改工位信息";
};

/** 提交按钮 */
const submitForm = () => {
  workstationsFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateWorkstations(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addWorkstations(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 提交工位分配按钮 */
const submitAllocationForm = () => {
  workstationUsageFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateWorkstationUsage(form.value).finally(
          () => (buttonLoading.value = false)
        );
      } else {
        await addWorkstationUsage(form.value).finally(
          () => (buttonLoading.value = false)
        );
      }
      proxy?.$modal.msgSuccess("工位分配操作成功");
      dialogAllocation.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: WorkstationsVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除工位主编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  await delWorkstations(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "system/workstations/export",
    {
      ...queryParams.value,
    },
    `workstations_${new Date().getTime()}.xlsx`
  );
};

onMounted(() => {
  getList();
  getTreeselect();
});

/** 查询空间区域管理下拉树结构 */
const getTreeselect = async () => {
  loading.value = true;
  const res = await spaceTreeSelect();
  spaceOptions.value = res.data;
  idLabelMap.value = flattenTreeToMap(spaceOptions.value);
  loading.value = false;
};

/** 节点单击事件 */
const handleNodeClick = (data: TreeVO) => {
  queryParams.value.spaceId = data.id;
  handleQuery();
};

/** 通过条件过滤节点  */
const filterNode = (value: string, data: any) => {
  if (!value) return true;
  return data.label.indexOf(value) !== -1;
};


/** 打开分配用户表弹窗 */
const openSelectUser = () => {
  selectUserRef.value?.show();
};

</script>
