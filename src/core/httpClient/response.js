
module.exports = class Response{
    constructor(content = null, status = 200, headers = []){
        this.content = content;
        this.status = status;
        this.headers = headers;
    }
    send(res){
        if(this.headers.length != 0) res.setheaders(this.headers);
        return res.status(this.status).send(this.content);
    }
    getContent(){
        return this.content;
    }
    setContent(content){
        this.content = content;
    }
    setStatus(status){
        this.status = status;
    }
    getStatus(){
        return this.status;
    }
    setheaders(headers){
        this.headers = headers;
    }
    addHeader(header){
        this.headers.push(header);
    }
}