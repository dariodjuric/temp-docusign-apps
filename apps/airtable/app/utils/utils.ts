import {
  type IComparisonOperation,
  type ILogicalOperation,
  type IOperation,
  LogicalOperator,
  type OperationUnion,
  Operator,
} from '@/types/docusign-types';
import { type EqualsCondition, type SimplifiedOperations } from '@/types/api';

export function isIComparisonOperation(
  obj: OperationUnion,
): obj is IComparisonOperation {
  return 'rightOperand' in obj;
}

interface ExtractedInfo {
  [key: string]: string | null;
}

export function extractKeyValuePairs(operation: OperationUnion): ExtractedInfo {
  const result: ExtractedInfo = {};

  function recursiveExtract(node: OperationUnion) {
    if (isIComparisonOperation(node)) {
      const { leftOperand, operator, rightOperand } = node;

      if (operator === Operator.EQUALS) {
        result[leftOperand.name] = rightOperand.name;
      }
    } else {
      if (node.leftOperation) {
        recursiveExtract(node.leftOperation);
      }
      if (node.rightOperation) {
        recursiveExtract(node.rightOperation);
      }
    }
  }

  recursiveExtract(operation);
  return result;
}

export function parseIntOrReturnNull(value?: string | null): number | null {
  if (value === '' || value === null || value === undefined) {
    return null;
  }

  const regex = /^\d+$/;

  if (regex.test(value)) {
    return parseInt(value.slice(0, -1), 10);
  } else {
    return null;
  }
}

/*
 This function transforms a binary tree of logical and comparison operations into a flat structure.
 Although Docusign only supports a single logical operator and a flat list of conditions, they internally
 represent them as a binary tree. By recursively traversing the tree, we extract all comparison operations
 and combine them into a single array of conditions, along with a single operator.

 It looks like they intend to support more complex operations in the future, but for now, we only need to
 support a single logical operator and a flat list of conditions.

 To read more: https://developers.docusign.com/extension-apps/extension-app-reference/extension-contracts/custom-query-language/
*/
export function parseOperation(
  rootOperation: ILogicalOperation,
): SimplifiedOperations {
  const conditions: EqualsCondition[] = [];
  const operator: LogicalOperator =
    rootOperation.operator || LogicalOperator.AND; // Default operator

  // Recursive function to traverse the operation tree
  // If there are more than 2 operations in the UI, they will be nested
  function traverseOperation(operation: IOperation): void {
    if (operation.$class.includes('ComparisonOperation')) {
      const comparisonOp = operation as IComparisonOperation;
      const leftOperand = comparisonOp.leftOperand.name;
      const rightOperand = comparisonOp.rightOperand.name;

      conditions.push({
        field: leftOperand,
        value: rightOperand,
      });
    } else if (operation.$class.includes('LogicalOperation')) {
      const logicalOp = operation as ILogicalOperation;

      if (logicalOp.leftOperation) {
        traverseOperation(logicalOp.leftOperation);
      }
      if (logicalOp.rightOperation) {
        traverseOperation(logicalOp.rightOperation);
      }
    }
  }

  traverseOperation(rootOperation);

  return { equalsConditions: conditions, operator };
}
