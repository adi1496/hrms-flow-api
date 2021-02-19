
exports.bodyParser = async(req, res, next) => {
    console.log(req.method, req.headers);
    const isPostPatch = req.method === 'POST' || req.method === 'PATCH';
    if(isPostPatch){
        if(req.headers['content-type'] === 'application/json'){
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            });
        
            req.on('end', () => {
                data = JSON.parse(data);
                // console.log(req.headers);
                req.body = data;
                next();
            });
        }
    }else {
        next();
    }
}