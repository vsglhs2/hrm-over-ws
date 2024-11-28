type InitializationInfo = {
    variant: TransportVariant;
    options: VariantOptions<TransportVariant>;
  }

export const initializationHandler = (info: InitializationInfo) => {
    console.log('Got initialize info:', info);
  
    const needChangeHandler = !store.info || !isSameObject(info, store.info);
    if (!needChangeHandler) {
      console.log('Initialization info is the same');
      return;
    }
  
    console.log('Changing handler...');
  
    const oldHandler = store.handler;
    oldHandler.close();
  
    console.log('Closed previous handler: ', oldHandler.constructor.name);
  
    const transport = createTransport(info.variant, info.options);
    store.handler = new TransportModuleHandler(transport);
    store.info = info;
  
    console.log('Created new handler: ', oldHandler.constructor.name);
  
    if (oldHandler instanceof BufferedHandler) {
      oldHandler.transfer(request => store.handler.request(request));
    }
  }