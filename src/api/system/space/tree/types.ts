export interface TreeVO {
  /**
   * 主键ID
   */
  id: string | number;

  /**
   * 父级ID，根节点为空或0
   */
  parentId: string | number;

  /**
   * 节点类型
   */
  type: string;

  /**
   * 工区名称
   */
  name: string;

  /**
   * 城市
   */
  city: string;

  /**
   * 详情地址
   */
  address: string;

  /**
   * 楼层编号
   */
  floorNumber: number;

  /**
   * 排序
   */
  sort: number;

  /**
   * 子对象
   */
  children: TreeVO[];
}

export interface TreeForm extends BaseEntity {
  /**
   * 主键ID
   */
  id?: string | number;

  /**
   * 父级ID，根节点为空或0
   */
  parentId?: string | number;

  /**
   * 节点类型
   */
  type?: string;

  /**
   * 工区名称
   */
  name?: string;

  /**
   * 城市
   */
  city?: string;

  /**
   * 详情地址
   */
  address?: string;

  /**
   * 楼层编号
   */
  floorNumber?: number;

  /**
   * 排序
   */
  sort?: number;
}

export interface TreeQuery {
  /**
   * 父级ID，根节点为空或0
   */
  parentId?: string | number;

  /**
   * 节点类型
   */
  type?: string;

  /**
   * 工区名称
   */
  name?: string;

  /**
   * 城市
   */
  city?: string;

  /**
   * 详情地址
   */
  address?: string;

  /**
   * 楼层编号
   */
  floorNumber?: number;

  /**
   * 排序
   */
  sort?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
