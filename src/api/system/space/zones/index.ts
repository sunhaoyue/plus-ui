import request from '@/utils/request';
import { AxiosPromise } from 'axios';
import { ZonesVO, ZonesForm, ZonesQuery } from '@/api/system/space/zones/types';

/**
 * 查询城市工区信息列表
 * @param query
 * @returns {*}
 */

export const listZones = (query?: ZonesQuery): AxiosPromise<ZonesVO[]> => {
  return request({
    url: '/system/zones/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询城市工区信息详细
 * @param id
 */
export const getZones = (id: string | number): AxiosPromise<ZonesVO> => {
  return request({
    url: '/system/zones/' + id,
    method: 'get'
  });
};

/**
 * 新增城市工区信息
 * @param data
 */
export const addZones = (data: ZonesForm) => {
  return request({
    url: '/system/zones',
    method: 'post',
    data: data
  });
};

/**
 * 修改城市工区信息
 * @param data
 */
export const updateZones = (data: ZonesForm) => {
  return request({
    url: '/system/zones',
    method: 'put',
    data: data
  });
};

/**
 * 删除城市工区信息
 * @param id
 */
export const delZones = (id: string | number | Array<string | number>) => {
  return request({
    url: '/system/zones/' + id,
    method: 'delete'
  });
};
