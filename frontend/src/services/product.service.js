import { secureClient } from "./client";

class ProductService {

    static listAll() {
        return new Promise((resolve, reject) => {
            secureClient.get("products")
                .then(resp => resolve(resp.data))
                .catch(err => reject(err));
        });
    }
}

export default ProductService;