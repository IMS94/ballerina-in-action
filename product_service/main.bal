import ballerina/http;
import ballerina/log;
import ballerina/sql;
import ballerinax/mysql;

configurable int httpPort = 8080;

configurable string mysqlHost = "localhost";
configurable int mysqlPort = 3306;
configurable string mysqlUser = "root";
configurable string mysqlPassword = "Admin123";
configurable string mysqlDatabase = "ballerina_productdb";

type Product record {|
    int id?;
    string productName;
    float price;
    string currency;
|};

@http:ServiceConfig {
    auth: [
        {
            jwtValidatorConfig: {
                signatureConfig: {
                    jwksConfig: {
                        url: "https://api.asgardeo.io/t/imeshaorg/oauth2/jwks"
                    }
                }
            }
        }
    ],
    cors: {
        allowOrigins: ["http://localhost:3000"]
    }
}
service /products on new http:Listener(httpPort) {

    # MySQL Client
    private mysql:Client mysqlClient;

    public function init() returns error? {
        self.mysqlClient = check new (mysqlHost, user = mysqlUser, password = mysqlPassword, database = mysqlDatabase);
    }

    resource function get .() returns Product[]|http:InternalServerError {
        stream<Product, error?> prodStream = self.mysqlClient->query(`select id, product_name as productName, price, currency from products`);
        Product[] products = [];
        error? e = prodStream.forEach(function(Product p) {
            products[products.length()] = p;
        });

        if e is error {
            return <http:InternalServerError> {
                body: e.message()
            };
        }

        log:printDebug("Found products", products = products);

        return products;
    }

    resource function post .(@http:Payload Product product) returns http:Created|http:InternalServerError {
        sql:ExecutionResult|sql:Error result = self.mysqlClient->execute(`insert into products (product_name, price, currency) values (${product.productName}, ${product.price}, ${product.currency})`);
        if result is sql:ExecutionResult {
            string|int? lastInsertId = result.lastInsertId;
            if lastInsertId is int|string {
                return <http:Created>{
                    headers: {
                        "location": string `products/${lastInsertId}`
                    }
                };
            }
            log:printWarn("Create product: last created id not found", result = result);
        } else {
            log:printError("Error occurred while inserting a product", product = product, 'error = result);
        }

        return <http:InternalServerError>{body: "Error occurred while creating product"};
    }

    resource function put .(@http:Payload Product product) returns http:Ok|http:InternalServerError {
        sql:ExecutionResult|sql:Error result = self.mysqlClient->execute(`update products set product_name = ${product.productName}, price = ${product.price}, currency=${product.currency} where id=${product?.id}`);
        if result is sql:ExecutionResult {
            log:printInfo("Updated product", product = product, result = result);
            int? affectedRowCount = result.affectedRowCount;
            if affectedRowCount is () {
                return <http:InternalServerError>{body: "Product not updated"};
            }
            return <http:Ok> {};
        } else {
            log:printError("Error occurred while updating a product", product = product, 'error = result);
            return <http:InternalServerError>{body: "Error occurred when updating product"};
        }
    }

    resource function get [int id]() returns Product|http:NotFound|http:InternalServerError {
        stream<Product, error?> prodStream = self.mysqlClient->query(`select id, product_name as productName, price, currency from products where id = ${id}`);
        record {|Product value;|}?|error next = prodStream.next();
        if next is error {
            return <http:InternalServerError>{};
        } else if next is () {
            return <http:NotFound>{};
        } else {
            return next.value;
        }
    }

    resource function delete [int id]() returns http:Ok|http:InternalServerError {
        sql:ExecutionResult|sql:Error result = self.mysqlClient->execute(`delete from products where id=${id}`);
        if result is sql:Error {
            log:printError("Error while deleting product", icd = id, 'error = result);
            return <http:InternalServerError>{
                body: result.message()
            };
        }
        log:printInfo("Deleted product", id = id);
        return <http:Ok>{};
    }
}
