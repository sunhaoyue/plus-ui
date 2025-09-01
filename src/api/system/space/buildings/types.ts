export interface BuildingsVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 所属工区ID，关联space_zones.id
   */
  zoneId: string | number;

  /**
   * 楼栋名称
   */
  buildingName: string;

  /**
   * 该楼栋总楼层数
   */
  floorCount: number;
}

export interface BuildingsForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 所属工区ID，关联space_zones.id
   */
  zoneId?: string | number;

  /**
   * 楼栋名称
   */
  buildingName?: string;

  /**
   * 该楼栋总楼层数
   */
  floorCount?: number;
}

export interface BuildingsQuery extends PageQuery {
  /**
   * 所属工区ID，关联space_zones.id
   */
  zoneId?: string | number;

  /**
   * 楼栋名称
   */
  buildingName?: string;

  /**
   * 该楼栋总楼层数
   */
  floorCount?: number;

  /**
   * 日期范围参数
   */
  params?: any;
}
