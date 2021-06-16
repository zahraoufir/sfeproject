module.exports = async function(httpRequest,httpResponse){
    const module = httpRequest.params.module, action = httpRequest.params.action;
    const request = Middlewares.input(httpRequest);
    if(Components[module] && Components[module].Schema){
        const schema = new Components[module].Schema();
        if(!schema.hasAction(action)) return Middlewares.output(httpResponse, new Response( 'invalid action', 401));
        const items = schema.getMiddlewares(action);
        for(let key in Object.values(items)){
            const response = await Middlewares[items[key]](request);
            if(response.getStatus() != 200) return Middlewares.output(httpResponse, response);
        }
    }else return Middlewares.output(httpResponse, new Response( 'invalid module', 401));
    const controller = new Components[module].Controller();
    const response = await controller[action](request);
    return Middlewares.output(httpResponse, response);
}

