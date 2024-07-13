import { defineStore } from "pinia";
import { reqC1,reqC2,reqC3 } from "../api/product/attr";
const useCategoryStore = defineStore('Category',{
    state:()=>{
        return{
            c1Arr:[],
            c1Id:'',
            c2Arr:[],
            c2Id:'',
            c3Arr:[],
            c3Id:'',
        }
    },
    actions:{
        async getC1(){
            const result:any = await reqC1();
            if(result.code==200){
                this.c1Arr=result.data
            }else{
                
            }
        },
        async getC2(){
            const result:any = await reqC2(this.c1Id);
            if(result.code==200){
                this.c2Arr=result.data
            }else{
                
            }
        },
        async getC3(){
            const result:any = await reqC3(this.c2Id);
            if(result.code==200){
                this.c3Arr=result.data
            }else{
                
            }
        }

    },
    getters:{

    }
})
export default useCategoryStore