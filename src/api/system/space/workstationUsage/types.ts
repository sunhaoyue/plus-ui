export interface WorkstationUsageVO {
  /**
   * 主键
   */
  id: string | number;

  /**
   * 使用员工
   */
  userId: string | number;

  /**
   * 使用工位
   */
  workstationId: string | number;

  /**
   * 所属空间区域I
   */
  spaceId: string | number;

  /**
   * 使用类型
   */
  usageType: number;

  /**
   * 使用开始时间
   */
  startTime: string;

  /**
   * 使用结束时间(NULL表示长期使用)
   */
  endTime: string;

  /**
   * 记录状态
   */
  status: number;

  /**
   * 是否长期分配标志
   */
  isLongTerm: string;

  /**
   * 使用备注信息
   */
  remark: string;

}

export interface WorkstationUsageForm extends BaseEntity {
  /**
   * 主键
   */
  id?: string | number;

  /**
   * 使用员工
   */
  userId?: string | number;

  /**
   * 使用工位
   */
  workstationId?: string | number;

  /**
   * 所属空间区域I
   */
  spaceId?: string | number;

  /**
   * 使用类型
   */
  usageType?: number;

  /**
   * 使用开始时间
   */
  startTime?: string;

  /**
   * 使用结束时间(NULL表示长期使用)
   */
  endTime?: string;

  /**
   * 记录状态
   */
  status?: number;

  /**
   * 是否长期分配标志
   */
  isLongTerm?: string;

  /**
   * 使用备注信息
   */
  remark?: string;

}

export interface WorkstationUsageQuery extends PageQuery {

  /**
   * 使用员工
   */
  userId?: string | number;

  /**
   * 使用工位
   */
  workstationId?: string | number;

  /**
   * 所属空间区域I
   */
  spaceId?: string | number;

  /**
   * 使用类型
   */
  usageType?: number;

  /**
   * 使用开始时间
   */
  startTime?: string;

  /**
   * 使用结束时间(NULL表示长期使用)
   */
  endTime?: string;

  /**
   * 记录状态
   */
  status?: number;

  /**
   * 是否长期分配标志
   */
  isLongTerm?: string;

    /**
     * 日期范围参数
     */
    params?: any;
}



