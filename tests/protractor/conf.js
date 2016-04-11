exports.config ={
    seleniumAddress:'http://localhost:4444/wd/hub',
    specs:['./navigation/event.open.board.spec.js'],

    onPrepare:function(){
        browser.driver.manage().window().setPosition(0,0);
        browser.driver.manage().window().setSize(1280,720);
        
    }
}