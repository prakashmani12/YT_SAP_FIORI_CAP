namespace my.bookshop;

entity Books {
    key ID : UUID;
    title : String; 
    author : String; 
    price : Decimal;
    stock : Integer;
    loc: String;
    genre : String;
}
