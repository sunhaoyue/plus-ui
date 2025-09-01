import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { WorkstationUsageVO, WorkstationUsageForm, WorkstationUsageQuery } from '@/api/system/space/workstationUsage/types';

/**
 * 查询工位使用记录列表
 * @param query
 * @returns {*}
 */

export const listWorkstationUsage = (query?: WorkstationUsageQuery): AxiosPromise<WorkstationUsageVO[]> => {
  return request({
    url: '/system/workstationUsage/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询工位使用记录详细
 * @param id
 */
export const getWorkstationUsage = (id: string | number): AxiosPromise<WorkstationUsageVO> => {
  return request({
    url: '/system/workstationUsage/' + id,
    method: 'get'
  });
};

/**
 * 新增工位使用记录
 * @param data
 */
export const addWorkstationUsage = (data: WorkstationUsageForm) => {
  return request({
    url: '/system/workstationUsage',
    method: 'post',
    data: data
  });
};

/**
 * 修改工位使用记录
 * @param data
 */
export const updateWorkstationUsage = (data: WorkstationUsageForm) => {
  return request({
    url: '/system/workstationUsage',
    method: 'put',
    data: data
  });
};

/**
 * 删除工位使用记录
 * @param id
 */
export const delWorkstationUsage = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/workstationUsage/' + id,
    method: 'delete'
  });
};
