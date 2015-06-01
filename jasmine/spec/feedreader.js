/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
    * a related set of tests. This suite is all about the RSS
    * feeds definitions, the allFeeds variable in our application.
    */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* it loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
         it('should contain a valid url', function () {
           allFeeds.forEach(function (feed) {
             expect(feed.url).toBeTruthy();
           });
         });


        /* it loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
         it('should contain a valid name', function() {
           allFeeds.forEach(function (feed) {
             expect(feed.name).toBeTruthy();
           });
         });
    });


    describe('The menu', function () {
      var menuIcon;
      var body;

      beforeEach(function (){
        menuIcon = $('.menu-icon-link');
        body = $('body');
      });

      /* it ensures the menu element is
       * hidden by default.
       */
      it('should cantain a hidden menu element by default', function () {
        expect(body.hasClass('menu-hidden')).toBeTruthy();
      });

      /* it ensures the menu changes
       * visibility when the menu icon is clicked. This test
       * should have two expectations: does the menu display when
       * clicked and does it hide when clicked again.
       */
      it('should toggle menu', function () {
        menuIcon.trigger('click');
        expect(body.hasClass('menu-hidden')).toBeFalsy();

        menuIcon.trigger('click');
        expect(body.hasClass('menu-hidden')).toBeTruthy();
      });
    });


    describe('Initial entries', function () {

      beforeEach(function (done) {
        loadFeed(0, done);
      });

      /* it ensures when the loadFeed
       * function is called and completes its work, there is at least
       * a single .entry element within the .feed container.
       */
      it('should contain at least one entry after loading feed', function () {
        expect($('.feed').children().length).toBeGreaterThan(0);
      });
    });


    describe('New Feed Selection', function () {
      var feedIndex;

      beforeEach(function (done) {
        feedIndex = 0;
        loadFeed(feedIndex, function () {
          done();
        });
      });

      /* it ensures when a new feed is loaded
       * by the loadFeed function that the content actually changes.
       * Remember, loadFeed() is asynchronous.
       */
      it('should update feed contents with each new feed selection', function (done) {
        var artifactChildren = $('.feed .entry h2');
        var artifactChildrenTitles = $.map(artifactChildren, function(element) {
          return $(element).text();
        });

        feedIndex++;

        loadFeed(feedIndex, function () {
          var successorChildren = $('.feed .entry h2');
          var successorChildrenTitles = $.map(successorChildren, function(element) {
            return $(element).text();
          });

          var diff = $(successorChildrenTitles).not(artifactChildrenTitles).get();

          expect(diff.length).not.toBe(0);

          done();
        });
      });
    });


    describe('Feed Mutation', function() {
      var feed;

      beforeEach(function () {
        feed = {
          name: 'example',
          url: 'https://feeds.example.com/'
        };
      });

      /* it ensures a new feed can be added
       */
      it('should be able to add new feed', function () {
        var lengthOld = allFeeds.length;
        var lengthNew = addFeed(feed);

        // Expect an increase in quantity
        expect(lengthOld + 1).toBe(lengthNew);

        // Expect the added feed to be among allFeeds
        var index = $.inArray(feed, allFeeds);
        expect(index).toBeGreaterThan(-1);

        // Expect the duplicate element insertion to be filtered
        var lengthAfterDuplicate = addFeed(feed);
        expect(lengthAfterDuplicate).toBe(lengthNew);
      });

      /* it ensures a new feed can be added
       */
      it('should be able to remove existing feed with given index', function () {
        // Ensure, we have at least 1 feed on the list
        var length = addFeed(feed);
        var lastFeedIndex = lengthOld - 1;
        var feedRemoved = removeFeed(lastFeedIndex);

        // Expect a decrease in quantity
        expect(length - 1).toBe(allFeeds.length);

        // Expect the removed feed not to be among allFeeds
        var index = $.inArray(feed, allFeeds);
        expect(index).toBe(-1);
      });
    });
}());
