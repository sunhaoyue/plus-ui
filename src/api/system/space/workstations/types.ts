export interface WorkstationsVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 工位唯一业务编码
   */
  workstationCode: string;

  /**
   * 工位名称(可选)
   */
  workstationName: string;

  /**
   * 所属空间
   */
  spaceId: string | number;

  /**
   * 工位所在楼层
   */
  floor: number;

  /**
   * 工位状态
   */
  status: number;

  /**
   * 使用类型
   */
  usageType: number;

}

export interface WorkstationsForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 工位唯一业务编码
   */
  workstationCode?: string;

  /**
   * 工位名称(可选)
   */
  workstationName?: string;

  /**
   * 所属空间
   */
  spaceId?: string | number;

  /**
   * 工位所在楼层
   */
  floor?: number;

  /**
   * 工位状态
   */
  status?: number;

  /**
   * 使用类型
   */
  usageType?: number;

}

export interface WorkstationsQuery extends PageQuery {

  /**
   * 工位唯一业务编码
   */
  workstationCode?: string;

  /**
   * 工位名称(可选)
   */
  workstationName?: string;

  /**
   * 所属空间
   */
  spaceId?: string | number;

  /**
   * 工位所在楼层
   */
  floor?: number;

  /**
   * 工位状态
   */
  status?: number;

  /**
   * 使用类型
   */
  usageType?: number;

    /**
     * 日期范围参数
     */
    params?: any;
}



