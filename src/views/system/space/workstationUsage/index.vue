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
                <el-form-item label="使用员工" prop="userId">
                  <el-input
                    v-model="queryParams.userId"
                    placeholder="请输入使用员工"
                    clearable
                    @keyup.enter="handleQuery"
                  />
                </el-form-item>
                <el-form-item label="使用工位" prop="workstationId">
                  <el-input
                    v-model="queryParams.workstationId"
                    placeholder="请输入使用工位"
                    clearable
                    @keyup.enter="handleQuery"
                  />
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
                <el-form-item label="使用开始时间" prop="startTime">
                  <el-date-picker
                    clearable
                    v-model="queryParams.startTime"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择使用开始时间"
                  />
                </el-form-item>
                <el-form-item label="使用结束时间" prop="endTime">
                  <el-date-picker
                    clearable
                    v-model="queryParams.endTime"
                    type="date"
                    value-format="YYYY-MM-DD"
                    placeholder="请选择使用结束时间(NULL表示长期使用)"
                  />
                </el-form-item>
                <el-form-item label="记录状态" prop="status">
                  <el-select
                    v-model="queryParams.status"
                    placeholder="请选择记录状态"
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
                <el-form-item label="是否长期分配标志" prop="isLongTerm">
                  <el-select
                    v-model="queryParams.isLongTerm"
                    placeholder="请选择是否长期分配标志"
                    clearable
                  >
                    <el-option
                      v-for="dict in sys_yes_no"
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
                  v-hasPermi="['system:workstationUsage:add']"
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
                  v-hasPermi="['system:workstationUsage:edit']"
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
                  v-hasPermi="['system:workstationUsage:remove']"
                  >删除</el-button
                >
              </el-col>
              <el-col :span="1.5">
                <el-button
                  type="warning"
                  plain
                  icon="Download"
                  @click="handleExport"
                  v-hasPermi="['system:workstationUsage:export']"
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
            :data="workstationUsageList"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column label="主键" align="center" prop="id" v-if="true" />
            <el-table-column label="使用员工" align="center" prop="userId" />
            <el-table-column label="使用工位" align="center" prop="workstationId" />
            <el-table-column label="所属空间区域" align="center" prop="spaceId">
              <template #default="scope">
                <el-tag type="success">
                  {{ idLabelMap.get(scope.row.spaceId) || "-" }}
                </el-tag>
              </template></el-table-column
            >
            <el-table-column label="使用类型" align="center" prop="usageType">
              <template #default="scope">
                <dict-tag :options="space_usage_type" :value="scope.row.usageType" />
              </template>
            </el-table-column>
            <el-table-column
              label="使用开始时间"
              align="center"
              prop="startTime"
              width="180"
            >
              <template #default="scope">
                <span>{{ parseTime(scope.row.startTime, "{y}-{m}-{d}") }}</span>
              </template>
            </el-table-column>
            <el-table-column
              label="使用结束时间"
              align="center"
              prop="endTime"
              width="180"
            >
              <template #default="scope">
                <span>{{ parseTime(scope.row.endTime, "{y}-{m}-{d}") }}</span>
              </template>
            </el-table-column>
            <el-table-column label="记录状态" align="center" prop="status">
              <template #default="scope">
                <dict-tag :options="space_status" :value="scope.row.status" />
              </template>
            </el-table-column>
            <el-table-column label="是否长期分配标志" align="center" prop="isLongTerm">
              <template #default="scope">
                <dict-tag :options="sys_yes_no" :value="scope.row.isLongTerm" />
              </template>
            </el-table-column>
            <el-table-column label="使用备注信息" align="center" prop="remark" />
            <el-table-column
              label="操作"
              align="center"
              class-name="small-padding fixed-width"
            >
              <template #default="scope">
                <el-tooltip content="修改" placement="top">
                  <el-button
                    link
                    type="primary"
                    icon="Edit"
                    @click="handleUpdate(scope.row)"
                    v-hasPermi="['system:workstationUsage:edit']"
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="删除" placement="top">
                  <el-button
                    link
                    type="primary"
                    icon="Delete"
                    @click="handleDelete(scope.row)"
                    v-hasPermi="['system:workstationUsage:remove']"
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

    <!-- 添加或修改工位使用记录对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
    >
      <el-form
        ref="workstationUsageFormRef"
        :model="form"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item label="使用员工" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入使用员工" />
        </el-form-item>
        <el-form-item label="使用工位" prop="workstationId">
          <el-input v-model="form.workstationId" placeholder="请输入使用工位" />
        </el-form-item>
        <el-form-item label="所属空间区域" prop="spaceId">
          <el-input v-model="form.spaceId" placeholder="请输入所属空间区域" />
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
        <el-form-item label="使用开始时间" prop="startTime">
          <el-date-picker
            clearable
            v-model="form.startTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择使用开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用结束时间" prop="endTime">
          <el-date-picker
            clearable
            v-model="form.endTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择使用结束时间(NULL表示长期使用)"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="记录状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in space_status"
              :key="dict.value"
              :value="parseInt(dict.value)"
              >{{ dict.label }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否长期分配标志" prop="isLongTerm">
          <el-select v-model="form.isLongTerm" placeholder="请选择是否长期分配标志">
            <el-option
              v-for="dict in sys_yes_no"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用备注信息" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容" />
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
  </div>
</template>

<script setup name="WorkstationUsage" lang="ts">
import {
  listWorkstationUsage,
  getWorkstationUsage,
  delWorkstationUsage,
  addWorkstationUsage,
  updateWorkstationUsage,
} from "@/api/system/space/workstationUsage";
import {
  WorkstationUsageVO,
  WorkstationUsageQuery,
  WorkstationUsageForm,
} from "@/api/system/space/workstationUsage/types";
import { spaceTreeSelect, getTree, flattenTreeToMap } from "@/api/system/space/tree";

import { TreeVO, TreeQuery, TreeForm } from "@/api/system/space/tree/types";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { space_usage_type, sys_yes_no, space_status } = toRefs<any>(
  proxy?.useDict("space_usage_type", "sys_yes_no", "space_status")
);

const workstationUsageList = ref<WorkstationUsageVO[]>([]);

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
const workstationUsageFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: WorkstationUsageForm = {
  id: undefined,
  userId: undefined,
  workstationId: undefined,
  spaceId: undefined,
  usageType: undefined,
  startTime: undefined,
  endTime: undefined,
  status: undefined,
  isLongTerm: undefined,
  remark: undefined,
};
const data = reactive<PageData<WorkstationUsageForm, WorkstationUsageQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    workstationId: undefined,
    spaceId: undefined,
    usageType: undefined,
    startTime: undefined,
    endTime: undefined,
    status: undefined,
    isLongTerm: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "主键不能为空", trigger: "blur" }],
    userId: [{ required: true, message: "使用员工不能为空", trigger: "blur" }],
    workstationId: [{ required: true, message: "使用工位不能为空", trigger: "blur" }],
    usageType: [{ required: true, message: "使用类型不能为空", trigger: "change" }],
    startTime: [{ required: true, message: "使用开始时间不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询工位使用记录列表 */
const getList = async () => {
  loading.value = true;
  const res = await listWorkstationUsage(queryParams.value);
  workstationUsageList.value = res.rows;
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
  workstationUsageFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: WorkstationUsageVO[]) => {
  ids.value = selection.map((item) => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
};

/** 新增按钮操作 */
const handleAdd = () => {
  reset();
  dialog.visible = true;
  dialog.title = "添加工位使用记录";
};

/** 修改按钮操作 */
const handleUpdate = async (row?: WorkstationUsageVO) => {
  reset();
  const _id = row?.id || ids.value[0];
  const res = await getWorkstationUsage(_id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改工位使用记录";
};

/** 提交按钮 */
const submitForm = () => {
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
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      await getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row?: WorkstationUsageVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal
    .confirm('是否确认删除工位使用记录编号为"' + _ids + '"的数据项？')
    .finally(() => (loading.value = false));
  await delWorkstationUsage(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
};

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download(
    "system/workstationUsage/export",
    {
      ...queryParams.value,
    },
    `workstationUsage_${new Date().getTime()}.xlsx`
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
</script>
