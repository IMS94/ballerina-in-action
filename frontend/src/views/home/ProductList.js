import { Box, Typography } from "@material-ui/core";
import { useEffect, useState } from "react";
import ProductService from "../../services/product.service";


const ProductList = () => {

    const [products, setProducts] = useState([]);

    useEffect(async () => {
        const products = await ProductService.listAll();
        setProducts(products);
    }, []);

    return (
        <Box>
            {products.map((product) => (
                <Box key={product.id}>
                    <Typography display="inline" variant="h6">{product.productName}</Typography>
                    <Typography display="inline">{" - "}{product.price} {product.currency}</Typography>
                </Box>
            ))}
        </Box>
    );
}

export default ProductList;