describe('Event Open Dashboard',function() {
    describe('When clicking on a dashboard',function() {
        it('Should open the board in the main view',function() {
            browser.get("http://localhost:3000/dashboards#/");


            var firstBoard = element.all(by.binding('label')).first();
            var label;

            firstBoard.getText().then(function(text){
               label=text;
            });

            firstBoard.click();

            browser.waitForAngular();

            var header = element(by.binding("currentBoard.label"));

            expect(header.getText()).toMatch("First Board");


        })
    })
})