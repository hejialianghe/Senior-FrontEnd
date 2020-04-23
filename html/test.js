(function(ROOT){
    function infoPop(){

    }

    function confirmPop(){

    }

    function cancelPop(){

    }

    function pop (type,content,color){
        switch(type){
            case 'infoPop':
            return new infoPop(content,color)
            case  'confirmPop':
            return new confirmPop(content,color)
            case  'confircancelPopmPop':
            return new cancelPop(content,color)
        }
    }
ROOT.pop=pop
})(window)

pop('infoPop','开始','white')