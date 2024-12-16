let domainList = ['http://localhost:4200', 'http://localhost:4500'];
module.exports = corsConfig = function(){
    if(domainList.indexOf(-1)){
        return true
    }else{
        console.log('not allow Domain')
    }
}