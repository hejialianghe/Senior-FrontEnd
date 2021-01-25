module.exports ={
    meta: {
        docs: {
            description:  "required class constructor",
            category: "Best Practices",
            recommended: true
        },
        fixable: null,
        schema: []
    },
    create: function(context){
        return {
            ClassDeclaration(node){
                const body = node.body.body;
                const result = body.some(
                    element => element.type === 'MethodDefinition' && element.kind === 'constructor'
                )
                if(!result){
                    context.report({
                        node,
                        message: 'no constuctor found'
                    })
                }
            }
        }
    }
}