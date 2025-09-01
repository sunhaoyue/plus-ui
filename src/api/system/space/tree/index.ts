import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { TreeVO, TreeForm, TreeQuery } from '@/api/system/space/tree/types';

/**
 * 查询空间树结构（工区-楼栋-楼层）列表
 * @param query
 * @returns {*}
 */

export const listTree = (query?: TreeQuery): AxiosPromise<TreeVO[]> => {
  return request({
    url: '/system/tree/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询空间树结构（工区-楼栋-楼层）详细
 * @param id
 */
export const getTree = (id: string | number): AxiosPromise<TreeVO> => {
  return request({
    url: '/system/tree/' + id,
    method: 'get'
  });
};

/**
 * 新增空间树结构（工区-楼栋-楼层）
 * @param data
 */
export const addTree = (data: TreeForm) => {
  return request({
    url: '/system/tree',
    method: 'post',
    data: data
  });
};

/**
 * 修改空间树结构（工区-楼栋-楼层）
 * @param data
 */
export const updateTree = (data: TreeForm) => {
  return request({
    url: '/system/tree',
    method: 'put',
    data: data
  });
};

/**
 * 删除空间树结构（工区-楼栋-楼层）
 * @param id
 */
export const delTree = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/tree/' + id,
    method: 'delete'
  });
};


/**
 * 查询部门下拉树结构
 */
export const spaceTreeSelect = (): AxiosPromise<TreeVO[]> => {
  return request({
    url: '/system/tree/spaceTree',
    method: 'get'
  });
};



/**预处理，建立 id -> label 的映射表（缓存）  */
export function flattenTreeToMap(tree, map = new Map()) {
  for (const node of tree) {
    map.set(node.id, node.label || node.name || '')
    if (node.children) {
      flattenTreeToMap(node.children, map)
    }
  }
  return map
};