class DataProcessingContext {
    
    constructor(strategy) {
      this.strategy = strategy;
    }
  
    setStrategy(strategy) {
      this.strategy = strategy;
    }
  
    async processData(data) {
      await this.strategy.process(data);
    }
  }
  
  export default DataProcessingContext;
  