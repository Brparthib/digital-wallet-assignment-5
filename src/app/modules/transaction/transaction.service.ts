import { Transaction } from "./transaction.model";
import { JwtPayload } from "jsonwebtoken";
import { QueryBuilder } from "../../utils/queryBuilder";
import { transactionSearchField } from "./transaction.constant";

const getAllTransactions = async (query: Record<string, string>) => {
  const queryBuilder = new QueryBuilder(Transaction.find(), query);

  const myTransactions = await queryBuilder
    .search(transactionSearchField)
    .filter()
    .sort()
    .fields()
    .paginate();

  const [data, meta] = await Promise.all([
    myTransactions.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

const getMyTransactions = async (
  decodedToken: JwtPayload,
  query: Record<string, string>
) => {
  const queryBuilder = new QueryBuilder(
    Transaction.find({
      $or: [{ fromUser: decodedToken.phone }, { toUser: decodedToken.phone }],
    }),
    query
  );

  const myTransactions = await queryBuilder
    .search(transactionSearchField)
    .filter()
    .paginate();

  const [data, meta] = await Promise.all([
    myTransactions.build(),
    queryBuilder.getMeta(),
  ]);

  return { data, meta };
};

export const transactionServices = {
  getAllTransactions,
  getMyTransactions,
};
