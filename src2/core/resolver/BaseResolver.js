import {LinkStrategy} from './strategy';

export default class BaseResolver {

  constructor() {
    this.alternativeStrategies = [];
    this.addAlternativeStrategy('link');
  }

  applyInterpolatedParams(response) {
    return response;
  }

  addAlternativeStrategy(...strategies) {
    if (!strategies || !strategies.length || !strategies.map) {
      return;
    }
    strategies
      .map((strategy) => {
        if (typeof strategy === 'string') {
          switch (strategy) {
            case 'link':
              return new LinkStrategy();
          }
          // invalid: internal alias unknown
          return;
        } else if (typeof strategy === 'object' && typeof strategy.buildAlternativeRequest === 'function') {
          return strategy;
        } else if (typeof strategy === 'function') {
          return {
            buildAlternativeRequest : strategy
          };
        } else {
          // invalid
          return;
        }
      })
      .filter((strategy) => strategy)
      .forEach((strategy) => this.alternativeStrategies.push(strategy));
  }

}
