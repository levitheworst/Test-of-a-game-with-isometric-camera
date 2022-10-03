//global_classes
class Player_Isometric
{
    constructor({size, position, velocity, src, srcsize})
    {
        this.size = size
        this.position = position
        this.velocity = velocity
        
        this.img = new Image()
        this.img.src = src
        this.srcsize = srcsize

        this.frame = 1
        this.frameState = 0
        this.framePerState = 3
        this.frameSpan = 10
        this.frameSpanLimit = 10
        this.frameCountIsProgressive = true

        this.interact = {
            size: {x: 2*this.size.x/3, y: 2*this.size.y/3}, 
            position: {x: this.position.x + 1*this.size.x/6, y: this.position.y + 1*this.size.y/6},
            toggle: false
        }
    }
    render()
    {
        if(userInput.e)ctx.fillRect(this.interact.position.x, this.interact.position.y, this.interact.size.x, this.interact.size.y)

        ctx.drawImage(this.img,
                (this.frame+(this.framePerState*this.frameState))*this.srcsize.x, 0,
                this.srcsize.x, this.srcsize.y,
                this.position.x, this.position.y,
                this.size.x, this.size.y
            )
    }
    update()
    {
        this.render()

        //physics
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.interact.position.x = this.position.x + 1*this.size.x/6
        this.interact.position.y = this.position.y + 1*this.size.y/6

        //controller
        if(userInput.right) this.velocity.x = 8
        else if(userInput.left) this.velocity.x = -8
        else this.velocity.x = 0

        if(userInput.down) this.velocity.y = 8
        else if(userInput.up) this.velocity.y = -8
        else this.velocity.y = 0

        userInput.e ? this.interact.toggle = true : this.interact.toggle = false

        //animation\\
        //frame control
            
        if(this.frame >= 2) this.frameCountIsProgressive = false
        else if(this.frame == 0) this.frameCountIsProgressive = true

        //sprite direction control
        this.velocity.y < 0 ? this.frameState = 3 : false
        this.velocity.y > 0 ? this.frameState = 0 : false
        this.velocity.x < 0 ? this.frameState = 1 : false
        this.velocity.x > 0 ? this.frameState = 2 : false
        
        //frame increase/decrease (on moving)
        if(this.velocity.x != 0 | this.velocity.y != 0)
        {
            if (this.frameCountIsProgressive && this.frameSpan % this.frameSpanLimit == 0) {
                this.frame++
            }
            else if (this.frameSpan % this.frameSpanLimit == 0) {
                this.frame--
            }
            this.frameSpan++
            if(this.frameSpan > 100)
            this.frameSpan = 0
        }
        else
        {
            this.frameSpan = 10
            this.frame = 1
        }
    }
}
class Player_SideScroll
{
    constructor({size, position, velocity, gravity, src, srcsize, faceright, isGrounded})
    {
        this.size = size
        this.position = position
        this.velocity = velocity
        this.gravity = gravity
        this.faceright = faceright
        this.isGrounded = isGrounded

        this.img = new Image()
        this.img.src = src
        this.srcsize = srcsize

        this.frame = 1
        this.frameState = 0
        this.framePerState = 4
        this.frameSpan = 10
        this.frameSpanLimit = 10
        this.frameCountIsProgressive = true

        this.interact = {
            size: {x: 3*this.size.x/4, y: 3*this.size.y/4}, 
            position: {x: this.position.x + 1*this.size.x/8, y: this.position.y + 1*this.size.y/8},
            toggle: false
        }
    }
    render()
    {
        if(userInput.e)ctx.fillRect(this.interact.position.x, this.interact.position.y, this.interact.size.x, this.interact.size.y)
        ctx.drawImage(this.img,
                (this.frame+(this.framePerState*this.frameState))*this.srcsize.x, 0,
                this.srcsize.x, this.srcsize.y,
                this.position.x, this.position.y,
                this.size.x, this.size.y
            )
    }
    update()
    {  
        if(this.faceright)
        {
            this.frameState = 1
            this.faceright = false
        }
        this.render()

        //physics
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y += this.gravity

        this.interact.position.x = this.position.x + 1*this.size.x/8
        this.interact.position.y = this.position.y + 1*this.size.y/8

        //controller
        if(userInput.up && this.isGrounded)
        {
            this.velocity.y = -16
            this.isGrounded = false
        }

        if(userInput.right) this.velocity.x <= 8 ? this.velocity.x += 2 : false
        else if(userInput.left) this.velocity.x >= -8 ? this.velocity.x -= 2 : false
        else if(this.velocity.x > 0) this.velocity.x -= 0.5
        else if(this.velocity.x < 0) this.velocity.x += 0.5

        userInput.e ? this.interact.toggle = true : this.interact.toggle = false

        //animation\\
            //frame control
        if(this.frame >= 2) this.frameCountIsProgressive = false
        else if(this.frame == 0) this.frameCountIsProgressive = true

        //sprite direction control
        this.velocity.x < 0 ? this.frameState = 0 : false
        this.velocity.x > 0 ? this.frameState = 1 : false

        if(this.velocity.x != 0)
        {
            if (this.frameSpan % this.frameSpanLimit == 0) this.frameCountIsProgressive ? this.frame++ : this.frame--
            this.frameSpan++
            if(this.frameSpan > 100)
            this.frameSpan = 0
        }
        else
        {
            this.frameSpan = 10
            this.frame = 1
        }
        !this.isGrounded ? this.frame = 3 : false
    }
}

class LvlSet_Isometric
{
    constructor({size, position, velocity, src, srcsize}) {
        this.player = new Player_Isometric({
            size: size,
            position: position,
            velocity: velocity,
            src: src,
            srcsize: srcsize
        })
    }
}
class LvlSet_SideScroll
{
    constructor(player, bg, fg, entities) {
        this.player = new Player_SideScroll(player)
        if (bg != undefined) this.bg = bg
        if (fg != undefined) this.fg = fg
        if (entities != undefined) this.entities = entities
    }
}
class Enemy_SideScroll
{
    constructor({size, position, velocity, gravity, src, srcsize, faceright, isGrounded})
    {
        this.size = size
        this.position = position
        this.velocity = velocity
        this.gravity = gravity
        this.rndface = true
        this.isGrounded = isGrounded

        this.img = new Image()
        this.img.src = src
        this.srcsize = srcsize

        this.frame = 1
        this.frameState = 0
        this.framePerState = 4
        this.frameSpan = 10
        this.frameSpanLimit = 10
        this.frameCountIsProgressive = true
    }
    render()
    {
        ctx.drawImage(this.img,
                (this.frame+(this.framePerState*this.frameState))*this.srcsize.x, 0,
                this.srcsize.x, this.srcsize.y,
                this.position.x, this.position.y,
                this.size.x, this.size.y
            )
    }
    update()
    {  
        if(Math.random() >= 0.5 && this.rndface)
        {
            this.frameState = 1
            this.rndface = false
        }
        this.render()

        //physics
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y += this.gravity

        this.interact.position.x = this.position.x + 1*this.size.x/8
        this.interact.position.y = this.position.y + 1*this.size.y/8

        //behavior

        

        //animation\\
            //frame control
        if(this.frame >= 2)
        {
            this.frameCountIsProgressive = false
        }
        else if(this.frame == 0)
        {
            this.frameCountIsProgressive = true
        }

        //sprite direction control
        this.velocity.x < 0 ? this.frameState = 0 : false
        this.velocity.x > 0 ? this.frameState = 1 : false

        if(this.velocity.x != 0)
        {
            if (this.frameCountIsProgressive && this.frameSpan % this.frameSpanLimit == 0) {
                this.frame++
            }
            else if (this.frameSpan % this.frameSpanLimit == 0) {
                this.frame--
            }
            this.frameSpan++
            if(this.frameSpan > 100)
            this.frameSpan = 0
        }
        else
        {
            this.frameSpan = 10
            this.frame = 1
        }
        if(!this.isGrounded) 
        {
            this.frame = 3
        }
    }
}
class Scenery_obj
{
    constructor({src, srcsize, pos1, pos2, update})
    {
        this.img = new Image()
        this.img.src = src
        this.imgsize = srcsize
        this.initialframe = 1
        this.span = 0

        pos1 != undefined ? this.pos1 = pos1 : this.pos1 = { x: 0, y: 0 }
        pos2 != undefined ? this.pos2 = pos2 : this.pos2 = { x: 0, y: 0 }

        this.update = update
    }
}