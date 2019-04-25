ax.filter = new (AX.Class.extend(
{
    find: function(e, p)
    {
        if (!e || !e.forEach)
            return;
        var ret = [];
        e.forEach(function(item, index)
        {
            for (var i in p)
                if (p[i] == undefined || p[i] != item[i])
                    return;
            ret.push(item);
        });
        return ret;
    },
    match_or: function(e, p)
    {
        if (!e || !e.forEach)
            return;
        var valid;
        for (var i in p)
            if (p[i] != undefined)
            {
                valid = true;
                break;
            }
        if (!valid)
            return e;
        var ret = [];
        e.forEach(function(item, index)
        {
            for (var i in p)
                if (p[i] == undefined || item[i].indexOf(p[i]) >= 0)
                {
                    ret.push(item);
                    break;
                }
        });
        return ret;
    },
    insert: function(e, p)
    {
        return p.concat(e);
    },
    random: function()
    {
        return Math.random();
    }
    
}))();
