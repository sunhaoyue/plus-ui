<template>
  <div class="p-2">
    <transition
      :enter-active-class="proxy?.animate.searchAnimate.enter"
      :leave-active-class="proxy?.animate.searchAnimate.leave"
    >
      <div v-show="showSearch" class="mb-[10px]">
        <el-card shadow="hover">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="父级节点" prop="parentId">
              <el-input
                v-model="queryParams.parentId"
                placeholder="请输入父级节点"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="节点类型" prop="type">
              <el-select
                v-model="queryParams.type"
                placeholder="请选择节点类型"
                clearable
              >
                <el-option
                  v-for="dict in space_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="工区名称" prop="name">
              <el-input
                v-model="queryParams.name"
                placeholder="请输入工区名称"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="城市" prop="city">
              <el-input
                v-model="queryParams.city"
                placeholder="请输入城市"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="详情地址" prop="address">
              <el-input
                v-model="queryParams.address"
                placeholder="请输入详情地址"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="楼层编号" prop="floorNumber">
              <el-input
                v-model="queryParams.floorNumber"
                placeholder="请输入楼层编号"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item label="排序" prop="sort">
              <el-input
                v-model="queryParams.sort"
                placeholder="请输入排序"
                clearable
                @keyup.enter="handleQuery"
              />
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
              @click="handleAdd()"
              v-hasPermi="['system:tree:add']"
              >新增</el-button
            >
          </el-col>
          <el-col :span="1.5">
            <el-button type="info" plain icon="Sort" @click="handleToggleExpandAll"
              >展开/折叠</el-button
            >
          </el-col>
          <right-toolbar
            v-model:showSearch="showSearch"
            @queryTable="getList"
          ></right-toolbar>
        </el-row>
      </template>
      <el-table
        ref="treeTableRef"
        v-loading="loading"
        :data="treeList"
        row-key="id"
        border
        :default-expand-all="isExpandAll"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column label="节点类型" align="center" prop="type">
          <template #default="scope">
            <dict-tag :options="space_type" :value="scope.row.type" />
          </template>
        </el-table-column>
        <el-table-column label="工区名称" align="center" prop="name" />
        <el-table-column label="城市" align="center" prop="city" />
        <el-table-column label="详情地址" align="center" prop="address" />
        <el-table-column label="楼层编号" align="center" prop="floorNumber" />
        <el-table-column label="排序" align="center" prop="sort" />
        <el-table-column label="删除标志" align="center" prop="delFlag">
          <template #default="scope">
            <dict-tag :options="sys_yes_no" :value="scope.row.delFlag" />
          </template>
        </el-table-column>
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
                v-hasPermi="['system:tree:edit']"
              />
            </el-tooltip>
            <el-tooltip content="新增" placement="top">
              <el-button
                link
                type="primary"
                icon="Plus"
                @click="handleAdd(scope.row)"
                v-hasPermi="['system:tree:add']"
              />
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button
                link
                type="primary"
                icon="Delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['system:tree:remove']"
              />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加或修改空间区域管理对话框 -->
    <el-dialog
      :title="dialog.title"
      v-model="dialog.visible"
      width="500px"
      append-to-body
    >
      <el-form ref="treeFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="父级节点" prop="parentId">
          <el-tree-select
            v-model="form.parentId"
            :data="treeOptions"
            :props="{ value: 'id', label: 'name', children: 'children' }"
            value-key="id"
            placeholder="请选择父级节点"
            check-strictly
          />
        </el-form-item>
        <el-form-item label="节点类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择节点类型">
            <el-option
              v-for="dict in space_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工区名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入工区名称" />
        </el-form-item>
        <el-form-item label="城市" prop="city">
          <el-input v-model="form.city" placeholder="请输入城市" />
        </el-form-item>
        <el-form-item label="详情地址" prop="address">
          <el-input v-model="form.address" placeholder="请输入详情地址" />
        </el-form-item>
        <el-form-item label="楼层编号" prop="floorNumber">
          <el-input v-model="form.floorNumber" placeholder="请输入楼层编号" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请输入排序" />
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

<script setup name="Tree" lang="ts">
import { listTree, getTree, delTree, addTree, updateTree } from "@/api/system/space/tree";
import { TreeVO, TreeQuery, TreeForm } from "@/api/system/space/tree/types";

type TreeOption = {
  id: number;
  name: string;
  children?: TreeOption[];
};

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const { space_type, sys_yes_no } = toRefs<any>(
  proxy?.useDict("space_type", "sys_yes_no")
);

const treeList = ref<TreeVO[]>([]);
const treeOptions = ref<TreeOption[]>([]);
const buttonLoading = ref(false);
const showSearch = ref(true);
const isExpandAll = ref(true);
const loading = ref(false);

const queryFormRef = ref<ElFormInstance>();
const treeFormRef = ref<ElFormInstance>();
const treeTableRef = ref<ElTableInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: "",
});

const initFormData: TreeForm = {
  id: undefined,
  parentId: undefined,
  type: undefined,
  name: undefined,
  city: undefined,
  address: undefined,
  floorNumber: undefined,
  sort: undefined,
};

const data = reactive<PageData<TreeForm, TreeQuery>>({
  form: { ...initFormData },
  queryParams: {
    parentId: undefined,
    type: undefined,
    name: undefined,
    city: undefined,
    address: undefined,
    floorNumber: undefined,
    sort: undefined,
    params: {},
  },
  rules: {
    id: [{ required: true, message: "主键ID不能为空", trigger: "blur" }],
    type: [{ required: true, message: "节点类型不能为空", trigger: "change" }],
    name: [{ required: true, message: "工区名称不能为空", trigger: "blur" }],
  },
});

const { queryParams, form, rules } = toRefs(data);

/** 查询空间区域管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listTree(queryParams.value);
  const data = proxy?.handleTree<TreeVO>(res.data, "id", "parentId");
  if (data) {
    treeList.value = data;
    loading.value = false;
  }
};

/** 查询空间区域管理下拉树结构 */
const getTreeselect = async () => {
  const res = await listTree();
  treeOptions.value = [];
  const data: TreeOption = { id: 0, name: "顶级节点", children: [] };
  data.children = proxy?.handleTree<TreeOption>(res.data, "id", "parentId");
  treeOptions.value.push(data);
};

// 取消按钮
const cancel = () => {
  reset();
  dialog.visible = false;
};

// 表单重置
const reset = () => {
  form.value = { ...initFormData };
  treeFormRef.value?.resetFields();
};

/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
};

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
};

/** 新增按钮操作 */
const handleAdd = (row?: TreeVO) => {
  reset();
  getTreeselect();
  if (row != null && row.id) {
    form.value.parentId = row.id;
  } else {
    form.value.parentId = 0;
  }
  dialog.visible = true;
  dialog.title = "添加空间区域管理";
};

/** 展开/折叠操作 */
const handleToggleExpandAll = () => {
  isExpandAll.value = !isExpandAll.value;
  toggleExpandAll(treeList.value, isExpandAll.value);
};

/** 展开/折叠操作 */
const toggleExpandAll = (data: TreeVO[], status: boolean) => {
  data.forEach((item) => {
    treeTableRef.value?.toggleRowExpansion(item, status);
    if (item.children && item.children.length > 0) toggleExpandAll(item.children, status);
  });
};

/** 修改按钮操作 */
const handleUpdate = async (row: TreeVO) => {
  reset();
  await getTreeselect();
  if (row != null) {
    form.value.parentId = row.parentId;
  }
  const res = await getTree(row.id);
  Object.assign(form.value, res.data);
  dialog.visible = true;
  dialog.title = "修改空间区域管理";
};

/** 提交按钮 */
const submitForm = () => {
  treeFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      if (form.value.id) {
        await updateTree(form.value).finally(() => (buttonLoading.value = false));
      } else {
        await addTree(form.value).finally(() => (buttonLoading.value = false));
      }
      proxy?.$modal.msgSuccess("操作成功");
      dialog.visible = false;
      getList();
    }
  });
};

/** 删除按钮操作 */
const handleDelete = async (row: TreeVO) => {
  await proxy?.$modal.confirm('是否确认删除空间区域管理编号为"' + row.id + '"的数据项？');
  loading.value = true;
  await delTree(row.id).finally(() => (loading.value = false));
  await getList();
  proxy?.$modal.msgSuccess("删除成功");
};

onMounted(() => {
  getList();
});
</script>
