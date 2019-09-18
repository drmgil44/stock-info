// class for login RESTful api
export class Company{
  ticker: string;
  name: string;
}

export class Stock{
  name: string;
  value: string;
}

export class StockHistory{
  name: string;
  value1: String; // last year
  value2: String; // 2 years ago
  value3: String; // 3 years ago
  value4: String; // 4 years ago
  value5: String; // 5 years ago
}
