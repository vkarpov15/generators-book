'use strict';

const assert = require('assert');

describe('Chapter 4: Transpiling', () => {
  /** @import:content/chapter-4-intro.md */
  it('', done => {
    const regenerator = require('regenerator');

    const code = regenerator.compile(`
  const generatorFunction = function*() {
    yield 'Hello, World!';
  };`).code;

    // Given the above simple generator function, regenerator will produce
    // the below code.
    assert.equal(code, `
  var generatorFunction = regeneratorRuntime.mark(function callee$0$0() {
    return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
      while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        context$1$0.next = 2;
        return 'Hello, World!';
      case 2:
      case "end":
        return context$1$0.stop();
      }
    }, callee$0$0, this);
  });`);
    // acquit:ignore:start
    done();
    // acquit:ignore:end
  });

  /** @import:content/chapter-4-regenerator.md */
  it('Introducing Regenerator', done => {
    const co = require('co');
    const superagent = require('superagent');

    // `plainFunction` is **not** a generator function because
    // it isn't declared with `function*() {}`. However, it returns
    // an object that qualifies as a generator.
    var plainFunction = function() {
      return {
        // `next()` and `throw()` are the only properties necessary for
        // an object to qualify as a generator.
        next: () => {
          return {
            // Note that this generator's `next()` returns a promise
            value: superagent.get('http://www.google.com'),
            done: true
          };
        },
        // `throw()` doesn't get used in this example
        throw: (error) => { throw error; }
      };
    };

    co(function*() {
      // You can use the fake generator returned by `plainFunction`
      // with co, since it "yields" a promise.
      const res = yield plainFunction();
      // res.text now contains Google's home page HTML!
      // acquit:ignore:start
      assert.ok(res.text);
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-4-regenerator-2.md */
  it('', done => {
    const co = require('co');
    const regenerator = require('regenerator');
    const superagent = require('superagent');
    // Necessary to include the `regeneratorRuntime` variable
    // that you use in the below generated code.
    regenerator.runtime();

    // The below code is regenerator's output when it transpiles
    //
    // const generatorFunction = function*() {
    //   return superagent.get('http://www.google.com');
    // };
    var generatorFunction = regeneratorRuntime.mark(function callee$0$0() {
      return regeneratorRuntime.wrap(function callee$0$0$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
        case 0:
          return context$1$0.abrupt("return",
            superagent.get('http://www.google.com'));
        case 1:
        case "end":
          return context$1$0.stop();
        }
      }, callee$0$0, this);
    });

    // 'GeneratorFunction'
    generatorFunction.constructor.name;
    // acquit:ignore:start
    assert.equal(generatorFunction.constructor.name, 'GeneratorFunction');
    // acquit:ignore:end

    co(generatorFunction).then((res) => {
      // res.text contains google's home page!
      // acquit:ignore:start
      assert.ok(res.text);
      done();
      // acquit:ignore:end
    });
  });

  /** @import:content/chapter-4-fake-intro.md */
  it('Faking a Generator Function', done => {
    const co = require('co');
    const superagent = require('superagent');

    // Behaves like the below generator function:
    // const generatorFunction = function*() {
    //   return (yield superagent.get('http://www.google.com')).text;
    // };
    const fakeGeneratorFunction = function() {
      let step = 0;
      const numSteps = 2;
      // This function takes the value that was passed to `next()` and
      // the 'step' that the generator is on.
      const generatorLogic = function(v, step) {
        if (step === 0) return superagent.get('http://www.google.com');
        if (step === 1) return v.text;
      }

      return {
        next: (v) => {
          // For the first n-1 functions, return `done: false`
          if (step < numSteps - 1) {
            return { done: false, value: generatorLogic(v, step++) };
          }
          // For last function, return `done: true`
          // (like a `return` in a generator)
          return { done: true, value: generatorLogic(v, step++) };
        },
        throw: (error) => { throw error; }
      }
    };

    // acquit:ignore:start
    co(function*() {
      const html = yield fakeGeneratorFunction();
      assert.ok(html);
      done();
    });
    // acquit:ignore:end
  });

  /** @import:content/chapter-4-fake-full.md */
  it('', done => {
    // acquit:ignore:start
    const co = require('co');
    const superagent = require('superagent');
    // acquit:ignore:end
    // Behaves like the below generator function:
    // const generatorFunction = function*() {
    //   let res;
    //   try {
    //     res = yield superagent.get('http://notvalid.baddomain');
    //   } catch(err) {
    //     return 'Failed';
    //   }
    //   return res.text;
    // };
    const fakeGeneratorFunction = function() {
      let step = 0;
      let variables = {};
      const numSteps = 2;
      const result = (value, done) => {
        return { value: value, done: done };
      };
      const url = 'http://nota.baddomain';

      const generatorLogic = function(v, step, error) {
        if (step === 0) return result(superagent.get(url), false);
        // This is the catch block
        if (step === 1 && error) return result('Failed', true);
        if (step === 1) {
          variables['res'] = v;
          return result(variables['res'].text, true);
        }
        if (error) throw error;
      }

      return {
        next: (v) => generatorLogic(v, step++),
        // `throw()` needs to set the error parameter to `next()`
        throw: (error) => generatorLogic(null, step++, error)
      }
    };
    // acquit:ignore:start
    co(function*() {
      const html = yield fakeGeneratorFunction();
      assert.equal(html, 'Failed');
      done();
    }).catch(done);
    // acquit:ignore:end
  });

  /** @import:content/chapter-4-parsing-intro.md */
  it('Parsing Generators With Esprima', (done) => {
    const esprima = require('esprima');

    const parsed = esprima.parse(`
  const generatorFunction = function*() {
    return 'Hello, World';
  };`).body;

    /* `parsed` is an array that looks like what you see below
    [
      {
        "type": "VariableDeclaration",
        "declarations": [
          {
            "type": "VariableDeclarator",
            "id": {
              "type": "Identifier",
              "name": "generatorFunction"
            },
            "init": {
              "type": "FunctionExpression",
              "id": null,
              "params": [],
              "defaults": [],
              "body": {
                "type": "BlockStatement",
                "body": [
                  {
                    "type": "ReturnStatement",
                    "argument": {
                      "type": "Literal",
                      "value": "Hello, World",
                      "raw": "'Hello, World'"
                    }
                  }
                ]
              },
              "generator": true,
              "expression": false
            }
          }
        ],
        "kind": "const"
      }
    ]
    */
    // acquit:ignore:start
    done();
    // acquit:ignore:end
  });

  /** @import:content/chapter-4-parsing-2.md */
  it('', () => {
    const esprima = require('esprima');
    const estraverse = require('estraverse');

    const parsed = esprima.parse(`
  const generatorFunction = function*() {
    yield function*() {
      yield 'Hello, World!';
    };
  };`);

    let numGenerators = 0;
    estraverse.traverse(parsed, {
      enter: (node, parent) => {
        if (node.type === 'FunctionExpression' && node.generator) {
          ++numGenerators;
        }
      },
      leave: () => {}
    });
    assert.equal(numGenerators, 2);
  });

  /** @import:content/chapter-4-count-yield.md */
  it('', () => {
    // acquit:ignore:start
    const esprima = require('esprima');
    const estraverse = require('estraverse');
    // acquit:ignore:end
    const parsed = esprima.parse(`
  const generatorFunction = function*() {
    yield function*() {
      yield 'Hello, World!';
    };
    yield 'Hello, World!';
  };`);

    let res = [];
    let stack = [];
    estraverse.traverse(parsed, {
      enter: (node, parent) => {
        if (node.type === 'FunctionExpression' && node.generator) {
          // We've found a new generator function, so add a 0 to the
          // result array and push the index of this generator function's
          // count in the result array onto the stack
          stack.push(res.length);
          res.push(0);
        } else if (node.type === 'YieldExpression') {
          // We've found a yield statement! Increment the current
          // generator function's count.
          ++res[stack[stack.length - 1]];
        }
      },
      leave: (node, parent) => {
        if (node.type === 'FunctionExpression' && node.generator) {
          // We've visited everything within a generator function, so
          // pop its index off the stack
          stack.pop();
        }
      }
    });
    assert.deepEqual(res, [2, 1]);
  });

  /** @import:content/chapter-4-transpiler.md */
  it('Write Your Own Transpiler', () => {
    const esprima = require('esprima');
    const estraverse = require('estraverse');
    const escodegen = require('escodegen');

    const parsed = esprima.parse(`
  const generatorFunction = function*() {
    yield 'Hello, World';
    return 'test';
  };`);

  const _parsed = esprima.parse(`var f = function*() { yield a(true); }`);
  console.log(JSON.stringify(_parsed, null, '  '));

    let steps = [];
    let generatorStack = [];
    estraverse.replace(parsed, {
      enter: (node, parent) => {
        if (node.type === 'FunctionExpression' && node.generator) {
          node.generator = false;
          node.params.push({ type: 'Identifier', name: 'v' });
          node.params.push({ type: 'Identifier', name: 'step' });
          node._steps = [[]];
          generatorStack.push(node);

          /*node.body.body = [{
            type: 'IfStatement',
            test: {
              type: 'BinaryExpression',
              operator: '===',
              left: { type: 'Identifier', name: 'step' },
              right: { type: 'Literal', value: 0, raw: '0' }
            },
            consequent: JSON.parse(JSON.stringify(node.body))
          }];*/

          return {
            type: 'CallExpression',
            callee: {
              type: 'Identifier',
              name: 'GeneratorFunction'
            },
            arguments: [node]
          }
        } else if (generatorStack.length && generatorStack[generatorStack.length - 1].body === parent) {
          const generator = generatorStack[generatorStack.length - 1];
          generator._steps[generator._steps.length - 1].push(node);
        }
      },
      leave: (node, parent) => {
        if (node.type === 'FunctionExpression' && node._steps) {
          var newBody = [];
          for (let i = 0; i < node._steps.length; ++i) {
            newBody.push({
              type: 'IfStatement',
              test: {
                type: 'BinaryExpression',
                operator: '===',
                left: { type: 'Identifier', name: 'step' },
                right: { type: 'Literal', value: i, raw: i.toString() }
              },
              consequent: {
                type: 'BlockStatement',
                body: JSON.parse(JSON.stringify(node._steps[i]))
              }
            });
          }
          node.body.body = newBody;
        } else if (node.type === 'YieldExpression' || node.type === 'ReturnStatement') {
          if (node.type === 'ReturnStatement') {
            node.argument = {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'generatorResult'
              },
              arguments: [
                node.argument,
                {
                  type: 'Literal',
                  value: true,
                  raw: 'true'
                }
              ]
            };
          } else if (node.type === 'YieldExpression') {
            node.type = 'ReturnStatement';
            node.argument = {
              type: 'CallExpression',
              callee: {
                type: 'Identifier',
                name: 'generatorResult'
              },
              arguments: [
                node.argument,
                {
                  type: 'Literal',
                  value: false,
                  raw: 'false'
                }
              ]
            };
          }

          generatorStack[generatorStack.length - 1]._steps.push([]);
        }
      }
    });

    console.log(escodegen.generate(parsed));
  });
});
