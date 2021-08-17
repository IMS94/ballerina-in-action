import ballerina/http;
import ballerina/log;
import ballerinax/mysql;

type Product record {|
    int id;
    string productName;
    float price;
    string currency;
|};

service /products on new http:Listener(8080) {

    private mysql:Client? cl = ();

    resource function get .() returns Product[]|error? {
        mysql:Client mysqlClient = check self.getClient();
        stream<Product, error?> prodStream = mysqlClient->query("select id, product_name as productName, price, currency from products", Product);
        Product[] products = [];
        error? e = prodStream.forEach(function(Product p) {
            products[products.length()] = p;
        });

        if e is error {
            return e;
        }

        log:printDebug("Found products", products = products);

        return products;
    }

    function getClient() returns mysql:Client|error {
        mysql:Client? mysqlClient = self.cl;
        if mysqlClient is () {
            self.cl = check new ("localhost", user = "root", password = "Imesha123", database = "bal_productdb");
            mysqlClient = self.cl;
        }

        if mysqlClient is mysql:Client {
            return mysqlClient;
        } else {
            return error("Client not created");
        }
    }
}

