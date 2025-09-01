import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { BuildingsVO, BuildingsForm, BuildingsQuery } from '@/api/system/space/buildings/types';

/**
 * 查询楼栋信息列表
 * @param query
 * @returns {*}
 */

export const listBuildings = (query?: BuildingsQuery): AxiosPromise<BuildingsVO[]> => {
  return request({
    url: '/system/buildings/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询楼栋信息详细
 * @param id
 */
export const getBuildings = (id: string | number): AxiosPromise<BuildingsVO> => {
  return request({
    url: '/system/buildings/' + id,
    method: 'get'
  });
};

/**
 * 新增楼栋信息
 * @param data
 */
export const addBuildings = (data: BuildingsForm) => {
  return request({
    url: '/system/buildings',
    method: 'post',
    data: data
  });
};

/**
 * 修改楼栋信息
 * @param data
 */
export const updateBuildings = (data: BuildingsForm) => {
  return request({
    url: '/system/buildings',
    method: 'put',
    data: data
  });
};

/**
 * 删除楼栋信息
 * @param id
 */
export const delBuildings = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/buildings/' + id,
    method: 'delete'
  });
};
