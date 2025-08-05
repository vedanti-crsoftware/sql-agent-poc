import sys
from sqlglot import parse_one, ParseError

def is_valid_postgres_sql(sql: str) -> bool:
    try:
        parse_one(sql, read='postgres')
        return True
    except ParseError:
        return False

if __name__ == "__main__":
    sql = sys.argv[1]
    print(is_valid_postgres_sql(sql))