import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { WorkstationsVO, WorkstationsForm, WorkstationsQuery } from '@/api/system/workstations/types';

/**
 * 查询工位主列表
 * @param query
 * @returns {*}
 */

export const listWorkstations = (query?: WorkstationsQuery): AxiosPromise<WorkstationsVO[]> => {
  return request({
    url: '/system/workstations/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询工位主详细
 * @param id
 */
export const getWorkstations = (id: string | number): AxiosPromise<WorkstationsVO> => {
  return request({
    url: '/system/workstations/' + id,
    method: 'get'
  });
};

/**
 * 新增工位主
 * @param data
 */
export const addWorkstations = (data: WorkstationsForm) => {
  return request({
    url: '/system/workstations',
    method: 'post',
    data: data
  });
};

/**
 * 修改工位主
 * @param data
 */
export const updateWorkstations = (data: WorkstationsForm) => {
  return request({
    url: '/system/workstations',
    method: 'put',
    data: data
  });
};

/**
 * 删除工位主
 * @param id
 */
export const delWorkstations = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/workstations/' + id,
    method: 'delete'
  });
};
