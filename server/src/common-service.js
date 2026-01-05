const cuid2 = require('@paralleldrive/cuid2');
const createIdShort = cuid2.init({length: 8});

class CommonService {

    generateId(length) {
        if(length) {
            const createId = cuid2.init({length: length});
            return createId();
        } else {
            const id = cuid2.createId();
            return id;
        }
    }

    generateIdShort() {
        const id = createIdShort();
        return id;
    }

}

module.exports = new CommonService();