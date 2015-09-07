export default class ScopeEmitter {

  constructor($scope) {
    this.$scope = $scope;
  }

  emit(name, ...args) {
    this.$scope.$emit(name, ...args);
    console.log(`EVENT emit: ${name}`, ...args);
  }

  broadcast(name, ...args) {
    this.$scope.$broadcast(name, ...args);
    console.log(`EVENT broadcast: ${name}`, ...args);
  }

}
