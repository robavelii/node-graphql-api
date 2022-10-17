import { Arg, Authorized, Ctx, Mutation, Resolver, Query } from 'type-graphql';
import { CreateProductInput, Product, GetProductInput } from '../schema/product.schema';
import ProductService from '../service/product.service';
import Context from '../types/context';

@Resolver()
export default class ProductResolver{
    constructor(private productService: ProductService){
        this.productService = new ProductService();
    }

    @Authorized()
    @Mutation(()=> Product)
    createProduct(@Arg('input') input: CreateProductInput, @Ctx() context: Context){
        const user = context.user;
        return this.productService.createProduct({ ...input, user: user?._id});
    }
    @Query(() => [Product])
  products() {
    return this.productService.findProducts();
  }

  @Query(() => Product)
  product(@Arg("input") input: GetProductInput) {
    return this.productService.findSingleProduct(input);
  }
}