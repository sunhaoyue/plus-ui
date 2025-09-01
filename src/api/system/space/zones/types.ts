export interface ZonesVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 工区所在城市名称
   */
  city: string;

  /**
   * 工区具体名称
   */
  zoneName: string;

  /**
   * 工区详细地址信息
   */
  address: string;
}

export interface ZonesForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 工区所在城市名称
   */
  city?: string;

  /**
   * 工区具体名称
   */
  zoneName?: string;

  /**
   * 工区详细地址信息
   */
  address?: string;
}

export interface ZonesQuery extends PageQuery {
  /**
   * 工区所在城市名称
   */
  city?: string;

  /**
   * 工区具体名称
   */
  zoneName?: string;

  /**
   * 工区详细地址信息
   */
  address?: string;

  /**
   * 日期范围参数
   */
  params?: any;
}
