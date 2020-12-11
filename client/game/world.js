class World {
    constructor() {
        this._entities = {};
    }

    containtsId(id) {
        return this._entities[id] ? true : false;
    }

    moveOutOfVision(id) {
        const ent = this._entities[id];
        if (ent) {
            ent.position.x = -100;
            ent.position.y = -100;
        }
    }

    deleteEntity(id) {
        delete this._entities[id];
    }

    verifyData(data) {
        //Verifies if the data can be transformed into an entity
        if (!data.position || !data.vertices || data.id === null || data.id === undefined) {
            return false;
        }
        return true;
    }

    createMessage(initialData, txt) {
        const newMsg = this.createEntity(initialData, {
            draw(ctx) {
                ctx.fillStyle = 'rgb(0, 0, 0)';
                ctx.font = '40px Arial';
                let x, y;
                x = newMsg.position.x;
                y = newMsg.position.y;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'Middle';
                ctx.fillText(newMsg.txt, x, y);
            },
            index: 10,
        });
        newMsg.txt = txt;

        return newMsg;
    }

    createDirArrows(id, player) {
        const width = 30,
            heigth = 40;

        const initialData = { id, position: { x: -50, y: -50 } };

        initialData.id = id + '.1';
        const top = this.createEntity(initialData, {
            draw(ctx) {
                ctx.fillStyle = 'red';
                top.position = {
                    x: top.player.position.x,
                    y: top.player.position.y - 50,
                };
                top.size = { x: width, y: heigth };
                ctx.fillRect(top.position.x, top.position.y, top.size.x, top.size.y);
            },
        });

        initialData.id = id + '.2';
        const bot = this.createEntity(initialData, {
            draw(ctx) {
                ctx.fillStyle = 'red';
                bot.position = {
                    x: bot.player.position.x,
                    y: bot.player.position.y + 50,
                };
                bot.size = { x: width, y: heigth };
                ctx.fillRect(bot.position.x, bot.position.y, bot.size.x, bot.size.y);
            },
        });

        initialData.id = id + '.3';
        const right = this.createEntity(initialData, {
            draw(ctx) {
                ctx.fillStyle = 'red';
                right.position = {
                    x: right.player.position.x + 50,
                    y: right.player.position.y,
                };
                right.size = { x: heigth, y: width };
                ctx.fillRect(right.position.x, right.position.y, right.size.x, right.size.y);
            },
        });

        initialData.id = id + '.4';
        const left = this.createEntity(initialData, {
            draw(ctx) {
                ctx.fillStyle = 'red';
                left.position = {
                    x: left.player.position.x - 50,
                    y: left.player.position.y,
                };
                left.size = { x: heigth, y: width };
                ctx.fillRect(left.position.x, left.position.y, left.size.x, left.size.y);
            },
        });

        const dirArrows = { top, bot, left, right };

        for (let side in dirArrows) {
            dirArrows[side].player = player;
        }

        dirArrows.getArea = (side) => {
            return { position: dirArrows[side].position, size: dirArrows[side].size };
        };

        return dirArrows;
    }

    createTurnIndicator(initialData, player) {
        const newTxt = this.createEntity(initialData, {
            draw(ctx) {
                ctx.fillStyle = 'rgb(0, 0, 0)';
                ctx.font = '20px Arial';
                let x, y;
                x = newTxt.player.position.x;
                y = newTxt.player.position.y;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'Middle';
                ctx.fillText('Turn', x, y - 40);
            },
            index: 10,
        });
        if (player) {
            newTxt.player = player;
        } else {
            newTxt.player = {
                position: { x: initialData.position.x, y: initialData.position.y },
            };
        }

        return newTxt;
    }

    createTile(initialData) {
        const newTile = this.createEntity(initialData, {
            wireframe: true,
            strokeStyle: 'green',
            lineWidth: 2,
            index: 0,
        });

        newTile.orientation = initialData.orientation;
        return newTile;
    }

    createPlayer(initialData) {
        const newPlayer = this.createEntity(initialData, {
            wireframe: true,
            strokeStyle: initialData.color,
            lineWidth: 4,
            index: 1,
        });
        newPlayer.username = initialData.username;
        newPlayer.points = initialData.points;

        return newPlayer;
    }

    createEntity(initialData, renderSettings) {
        const { position, id } = initialData;
        if (this._entities[id]) {
            return;
        }

        const newEntity = { position, render: {} };
        if (initialData.vertices) {
            newEntity.vertices = initialData.vertices;
        }

        const render = newEntity.render;
        if (renderSettings.wireframe) {
            render.wireframe = renderSettings.wireframe;
        }
        if (renderSettings.lineWidth) {
            render.lineWidth = renderSettings.lineWidth;
        }
        if (renderSettings.strokeStyle) {
            render.strokeStyle = renderSettings.strokeStyle;
        }
        if (renderSettings.index) {
            render.index = renderSettings.index;
        } else {
            render.index = 0;
        }
        if (renderSettings.draw) {
            render.draw = renderSettings.draw;
        }

        this._entities[id] = newEntity;
        return newEntity;
    }

    updateEntity(id, data) {
        if (!this._entities[id]) {
            return;
        }

        const entity = this._entities[id];
        for (let value in data) {
            if (entity[value]) {
                entity[value] = data[value];
            }
        }

        return entity;
    }

    updateRender(id, data) {
        if (!this._entities[id]) {
            return;
        }
        const entity = this._entities[id];
        for (let value in data) {
            if (entity.render[value]) {
                console.log('in');
                entity.render[value] = data[value];
            }
        }

        return entity;
    }

    get entities() {
        return this._entities;
    }
}
