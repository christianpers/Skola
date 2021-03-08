export default class UpdateLoopManager{
    constructor() {
        this._nodes = new Map();
    }

    add(node) {
        if (node.needsUpdate) {
            const currObj = this._nodes.get(node.ID);
            if (currObj) {
                const updatedObj = Object.assign({}, currObj, { count: currObj.count += 1 });
                this._nodes.set(node.ID, updatedObj);
            } else {
                const obj = {
                    count: 1,
                    node,
                };
                this._nodes.set(node.ID, obj);
            }
        }

    }

    delete(node) {
        if (this._nodes.has(node.ID)) {
            const obj = this._nodes.get(node.ID);
            obj.count--;
            if (obj.count <= 0) {
                this._nodes.delete(node.ID);
            }
            
        }

        
    }

    update() {
        this._nodes.forEach((value) => {
            value.node.update();
        });
    }

    render() {
        this._nodes.forEach((value) => {
            value.node.render();
        });
    }
}
