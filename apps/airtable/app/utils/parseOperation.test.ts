import {
  IComparisonOperation,
  ILogicalOperation,
  IOperand,
  LogicalOperator,
  OperandType,
  Operator,
} from '@/types/docusign-types';
import { describe, expect, it } from '@jest/globals';
import { parseOperation } from './utils';

describe('parseOperation', () => {
  function makeOperand(
    name: string,
    type: OperandType = OperandType.STRING,
  ): IOperand {
    return {
      $class: 'Operand',
      name,
      type,
      isLiteral: true,
    };
  }

  it('should return a single condition and default operator (EQUALS) if no operator is specified on logical level', () => {
    // A single ComparisonOperation as the root
    const rootOperation: IComparisonOperation = {
      $class: 'ComparisonOperation',
      // No logical operator at the root, it's just a comparison.
      leftOperand: makeOperand('boardName'),
      operator: Operator.EQUALS,
      rightOperand: makeOperand('test'),
    };

    // Cast to ILogicalOperation for the parseOperation signature if needed
    const result = parseOperation(
      rootOperation as unknown as ILogicalOperation,
    );

    expect(result).toEqual({
      equalsConditions: [{ field: 'boardName', value: 'test' }],
      operator: Operator.EQUALS, // Default operator when not specified at logical level
    });
  });

  it('should handle multiple comparison operations under a logical operation', () => {
    const rootOperation: ILogicalOperation = {
      $class: 'LogicalOperation',
      operator: LogicalOperator.OR,
      leftOperation: {
        $class: 'ComparisonOperation',
        leftOperand: makeOperand('boardName'),
        operator: Operator.EQUALS,
        rightOperand: makeOperand('test1'),
      } as IComparisonOperation,
      rightOperation: {
        $class: 'ComparisonOperation',
        leftOperand: makeOperand('taskName'),
        operator: Operator.EQUALS,
        rightOperand: makeOperand('test2'),
      } as IComparisonOperation,
    };

    const result = parseOperation(rootOperation);

    expect(result).toEqual({
      equalsConditions: [
        { field: 'boardName', value: 'test1' },
        { field: 'taskName', value: 'test2' },
      ],
      operator: LogicalOperator.OR,
    });
  });

  it('should handle deeply nested logical operations', () => {
    const rootOperation: ILogicalOperation = {
      $class: 'LogicalOperation',
      operator: LogicalOperator.AND,
      leftOperation: {
        $class: 'LogicalOperation',
        operator: LogicalOperator.AND,
        leftOperation: {
          $class: 'ComparisonOperation',
          leftOperand: makeOperand('status'),
          operator: Operator.EQUALS,
          rightOperand: makeOperand('active'),
        } as IComparisonOperation,
        rightOperation: {
          $class: 'ComparisonOperation',
          leftOperand: makeOperand('role'),
          operator: Operator.EQUALS,
          rightOperand: makeOperand('admin'),
        } as IComparisonOperation,
      } as ILogicalOperation,
      rightOperation: {
        $class: 'ComparisonOperation',
        leftOperand: makeOperand('region'),
        operator: Operator.EQUALS,
        rightOperand: makeOperand('US'),
      } as IComparisonOperation,
    };

    const result = parseOperation(rootOperation);

    expect(result).toEqual({
      equalsConditions: [
        { field: 'status', value: 'active' },
        { field: 'role', value: 'admin' },
        { field: 'region', value: 'US' },
      ],
      operator: LogicalOperator.AND,
    });
  });

  it('should return an empty conditions array if no comparison operations are present', () => {
    const rootOperation: ILogicalOperation = {
      $class: 'LogicalOperation',
      operator: LogicalOperator.OR,
      // No comparison operations, just another nested logical operation without them
      leftOperation: {
        $class: 'LogicalOperation',
        operator: LogicalOperator.AND,
        // No leftOperation/rightOperation with comparison here
      } as ILogicalOperation,
      rightOperation: {
        $class: 'LogicalOperation',
        operator: LogicalOperator.OR,
        // No leftOperation/rightOperation with comparison here
      } as ILogicalOperation,
    };

    const result = parseOperation(rootOperation);

    expect(result).toEqual({
      equalsConditions: [],
      operator: LogicalOperator.OR,
    });
  });

  it('should default to AND operator if a logical operator is not explicitly provided', () => {
    const rootOperation = {
      $class: 'LogicalOperation',
      // No operator specified here
      leftOperation: {
        $class: 'ComparisonOperation',
        leftOperand: makeOperand('category'),
        operator: Operator.EQUALS,
        rightOperand: makeOperand('books'),
      } as IComparisonOperation,
      rightOperation: {
        $class: 'ComparisonOperation',
        leftOperand: makeOperand('type'),
        operator: Operator.EQUALS,
        rightOperand: makeOperand('paperback'),
      } as IComparisonOperation,
    } as unknown as ILogicalOperation;

    const result = parseOperation(rootOperation);

    expect(result).toEqual({
      equalsConditions: [
        { field: 'category', value: 'books' },
        { field: 'type', value: 'paperback' },
      ],
      operator: LogicalOperator.AND, // Defaulted
    });
  });
});
