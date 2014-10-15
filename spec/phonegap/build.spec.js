/*
 * Module dependencies.
 */

var PhoneGap = require('../../lib/phonegap'),
    project = require('../../lib/phonegap/util/project'),
    cordova = require('cordova-lib').cordova,
    phonegap,
    options,
    qyes,
    qno;

/*
 * Specification: phonegap.build(options, [callback])
 */

describe('phonegap.build(options, [callback])', function() {
    beforeEach(function() {
        phonegap = new PhoneGap();
        options = {
            platforms: ['android']
        };
        qyes = {
            then : function(success, fail) {
                success();
                return qyes;
            }
        }
        qno = {
            then : function(success, fail) {
                fail(new Error("the promise has failed"));
                return qno;
            }
        }
        spyOn(process.stderr, 'write');
        spyOn(phonegap.local, 'build').andReturn(phonegap);
        spyOn(phonegap.remote, 'build').andReturn(phonegap);
        spyOn(cordova, 'platform');
        spyOn(project, 'cd').andReturn(true);
    });

    it('should require options', function() {
        expect(function() {
            options = undefined;
            phonegap.build(options, function(e) {});
        }).toThrow();
    });

    it('should require options.platforms', function() {
        expect(function() {
            options.platforms = undefined;
            phonegap.build(options, function(e) {});
        }).toThrow();
    });

    it('should not require callback', function() {
        expect(function() {
            phonegap.build(options);
        }).not.toThrow();
    });

    it('should change to project directory', function() {
        phonegap.build(options);
        expect(project.cd).toHaveBeenCalledWith({
            emitter: phonegap,
            callback: jasmine.any(Function)
        });
    });

    it('should return itself', function() {
        expect(phonegap.build(options)).toEqual(phonegap);
    });

    describe('with local environment', function() {
        it('should try to build the project locally', function() {
            var callback = function() {};
            phonegap.build(options, callback);
            expect(phonegap.local.build).toHaveBeenCalledWith(options, callback);
        });
    });

    describe('with remote environment', function() {
        beforeEach(function() {
            cordova.platform.andCallFake(function(){
                throw new Error;
            });
        });

        it('should try to build the project remotely', function() {
            var callback = function() {};
            phonegap.build(options, callback);
            expect(phonegap.remote.build).toHaveBeenCalledWith(options, callback);
        });
    });
});
