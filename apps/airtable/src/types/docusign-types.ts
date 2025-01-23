export type DataIOSearchRecordsInputType = {
  /**
   * The query to execute as the search criteria
   */
  query: IQuery;
  /**
   * The query to execute as the search criteria
   */
  pagination: Pagination;
};

/**
 * Enum representing the types of operands used in query operations.
 */
export enum OperandType {
  // Represents a string value
  STRING = 'STRING',
  // Represents an integer value
  INTEGER = 'INTEGER',
  // Represents a double-precision floating-point value.
  DOUBLE = 'DOUBLE',
  // Represents a long integer value
  LONG = 'LONG',
  // Represents a date and time value
  DATETIME = 'DATETIME',

  // Represents a boolean value
  BOOLEAN = 'BOOLEAN',
  // Represents an enumerated value
  ENUM = 'ENUM',
  // Represents a list of values
  LIST = 'LIST',
  // Represents a range of values
  RANGE = 'RANGE',
  // Represents other types of operands
  OTHER = 'OTHER',
  // Represents a placeholder type one
  PLACEHOLDER_TYPE_ONE = 'PLACEHOLDER_TYPE_ONE',
  // Represents a placeholder type two
  PLACEHOLDER_TYPE_TWO = 'PLACEHOLDER_TYPE_TWO',
  // Represents a placeholder type three
  PLACEHOLDER_TYPE_THREE = 'PLACEHOLDER_TYPE_THREE',
}
/**
 * Enum representing various operators used in query comparisons
 */
export enum Operator {
  // Represents equality comparison
  EQUALS = 'EQUALS',
  // Represents inequality comparison
  NOT_EQUALS = 'NOT_EQUALS',
  // Represents containment comparison
  CONTAINS = 'CONTAINS',
  // Represents non-containment comparison
  DOES_NOT_CONTAIN = 'DOES_NOT_CONTAIN',
  // Represents less-than comparison
  LESS_THAN = 'LESS_THAN',
  // Represents greater-than comparison
  GREATER_THAN = 'GREATER_THAN',
  // Represents less-than-or-equals-to comparison
  LESS_THAN_OR_EQUALS_TO = 'LESS_THAN_OR_EQUALS_TO',
  // Represents greater-than-or-equals-to comparison
  GREATER_THAN_OR_EQUALS_TO = 'GREATER_THAN_OR_EQUALS_TO',
  // Represents starts-with comparison
  STARTS_WITH = 'STARTS_WITH',
  // Represents non-starts-with comparison.
  DOES_NOT_START_WITH = 'DOES_NOT_START_WITH',
  // Represents ends-with comparison
  ENDS_WITH = 'ENDS_WITH',
  // Represents non-ends-with comparison.
  DOES_NOT_END_WITH = 'DOES_NOT_END_WITH',
  // Represents membership comparison
  IN = 'IN',
  // Represents non-membership comparison
  NOT_IN = 'NOT_IN',
  // Represents range comparison
  BETWEEN = 'BETWEEN',
  // Represents pattern matching comparison.
  LIKE = 'LIKE',
  // Represents custom comparison
  CUSTOM = 'CUSTOM',
}
/**
 * Enum representing logical operators used to combine query conditions.
 */
export enum LogicalOperator {
  // Represents logical AND operation
  AND = 'AND',
  // Represents logical OR operation
  OR = 'OR',
}
/**
 * Interface representing a concept within a query operation
 */
export interface IConcept {
  /**
   * The class name of the concept
   */
  $class: string;
}
/**
 * Interface representing an operation within a query.
 * @extends IConcept
 */
export interface IOperation extends IConcept {}
/**
 * Interface representing an operand within a query
 * @extends IConcept
 */

export interface IOperand extends IConcept {
  /**
   * The name of the operand
   */
  name: string;
  /**
   * The type of the operand
   * @typedef OperandType
   */
  type: OperandType;
  /**
   * A boolean to indicate if the operand is a literal value
   */
  isLiteral: boolean;
}

/**
 * Represents a union type for operations within a query
 * @typedef {IComparisonOperation | ILogicalOperation} OperationUnion
 */
export type OperationUnion = IComparisonOperation | ILogicalOperation;

/**
 * Interface representing a comparison operation within a query
 * @extends IOperation
 */
export interface IComparisonOperation extends IOperation {
  /**
   * The left operand of the comparison
   * @typedef Operand
   */
  leftOperand: IOperand;
  /**
   * The comparison operator
   * @typedef Operator
   */
  operator: Operator;
  /**
     * The right operand of the comparison
     * @typedef IOperand

     */
  rightOperand: IOperand;
}

/**
 * Interface representing a logical operation within a query
 * @extends IOperation
 */
export interface ILogicalOperation extends IOperation {
  /**
   * The left hand side of the logical operation
   */
  leftOperation: OperationUnion;
  /**
   * The logical operator
   * @typedef LogicalOperator
   */
  operator: LogicalOperator;
  /**
   * The right hand side of the logical operation
   */
  rightOperation: OperationUnion;
}
/**
 * Interface representing a query filter within a query
 * @extends IConcept
 */
export interface IQueryFilter extends IConcept {
  /**
   * The operation used as the query filter
   */
  operation: ILogicalOperation;
}
/**
 * Interface for representing a query
 * @extends IConcept
 */
export interface IQuery extends IConcept {
  /**
   * The attributes to be selected in the query
   */
  attributesToSelect: string[];
  /**
   * The name of the type present in the external system of
   * record that the query is executed against
   */
  from: string;
  /**
   * The filter conditions applied on the type
   */
  queryFilter: IQueryFilter;
}

/**
 * Represents pagination parameters used for controlling
 * the number of records returned in a query
 */
export type Pagination = {
  /**
   * The maximum number of records to be returned per page
   */
  limit: number;
  /**
   * The number of records to skip before starting to return records
   */
  skip: number;
};

export type DataIOPatchRecordInputType = {
  /**
   * The type name of the record that is being patched
   */
  typeName: string;
  /**
   * The identifier of the record to patch
   */
  recordId: string;
  /**
   * Includes only the portions of the record that require updating
   */
  data: Record<string, any>;
};

export type DataIOCreateRecordInputType = {
  /**
   * The type name of the record that is being created
   */
  typeName: string;
  /**
   * Optional identifier of the new record.
   * The external source may not accept the provided identifier and choose its
   own. */
  recordId?: string;
  /**
   * A unique key the application may use to identify duplicate (retry)
   requests. */
  idempotencyKey?: string;
  /**
   * Data to apply to the new record.
   */
  data: Record<string, any>;
};
