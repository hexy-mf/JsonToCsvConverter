var LinkedList = function() {
    this.first = null;
    this.last = null;
    this.add = function(data) {
        var currentItem = {
            before : null,
            after : null,
            data : data
        };
        if(this.first === null){
            this.first = currentItem;
            this.last = currentItem;
        } else {
            this.last.after = currentItem;
            currentItem.before = this.last;
            this.last = currentItem;
        }
    };
    this.concat = function(concatList){
        if(concatList instanceof LinkedList) {
            for(var item in concatList) 
            {
                this.add(item);
            }
        }
        return this;
    };
    this[Symbol.iterator]= function () {
        var current;
        return{
            next: function () {
                if(current == null) {
                    current = this.first;
                    return { key: this._index, value: current.data, done: false};
                }
                if(current.after !== null )
                {
                    return {key: this._index, value: current.after(), done: false };
                }
                else
                {
                    return{ done: true }; 
                }
            }
        }
    };
};