import ballerina/http;
import ballerina/log;
import ballerina/sql;
import ballerinax/mysql;

configurable string mysqlHost = "localhost";
configurable int mysqlPort = 3306;
configurable string mysqlUser = "root";
configurable string mysqlPassword = "Imesha123";
configurable string mysqlDatabase = "bal_productdb";


type Product record {|
    int id?;
    string productName;
    float price;
    string currency;
|};

isolated service /products on new http:Listener(8080) {

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

    resource function post .(@http:Payload Product product) returns record {|*http:Created;|}|error? {
        mysql:Client cl = check self.getClient();
        sql:ExecutionResult|sql:Error result = cl->execute(`insert into products (product_name, price, currency) values (${product.productName}, ${product.price}, ${product.currency})`);
        if result is sql:ExecutionResult {
            string|int? lastInsertId = result.lastInsertId;
            if lastInsertId is int|string {
                return {
                    headers: {
                        "location": string `products/${lastInsertId}`
                    }
                };
            }
            log:printWarn("Create product: last created id not found", result = result);
        } else {
            log:printError("Error occurred while inserting a product", product = product, 'error = result);
        }

        return error("Error occurred while creating product", 'error = result);
    }

    resource function put .(@http:Payload Product product) returns record {*http:Ok;}|error? {
        mysql:Client cl = check self.getClient();
        sql:ExecutionResult|sql:Error result = cl->execute(`update products set product_name = ${product.productName}, price = ${product.price}, currency=${product.currency} where id=${product?.id}`);
        if result is sql:ExecutionResult {
            log:printInfo("Updated product", product = product, result = result);
            int? affectedRowCount = result.affectedRowCount;
            if affectedRowCount is () {
                return error("Product not updated", product = product);
            }
        } else {
            log:printError("Error occurred while updating a product", product = product, 'error = result);
            return error("Error occurred when updating product", product = product, 'error = result);
        }
    }

    resource function get [int id]() returns Product?|error? {
        mysql:Client mysqlClient = check self.getClient();
        stream<Product, error?> prodStream = mysqlClient->query(`select id, product_name as productName, price, currency from products where id = ${id}`, Product);
        record {|Product value;|}? next = check prodStream.next();
        if next is () {
            return;
        } else {
            return next.value;
        }
    }

    resource function delete [int id]() returns record {*http:Ok;}|error? {
        mysql:Client cl = check self.getClient();
        sql:ExecutionResult|sql:Error result = cl->execute(`delete from products where id=${id}`);
        if result is sql:Error {
            log:printError("Error while deleting product", id = id, 'error = result);
            return result;
        }
        log:printInfo("Deleted product", id = id);
    }

    isolated function getClient() returns mysql:Client|error {
        lock {
            mysql:Client? currentMySqlClient = self.cl;
            if currentMySqlClient is mysql:Client {
                return currentMySqlClient;
            }

            mysql:Client mysqlClient = check new (mysqlHost, user = mysqlUser, password = mysqlPassword, database = mysqlDatabase);
            self.cl = mysqlClient;
            return mysqlClient;
        }
    }
}
