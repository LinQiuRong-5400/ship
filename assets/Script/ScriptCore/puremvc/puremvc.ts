
export namespace puremvc {
 /**
 * The interface definition for a PureMVC notification.
 *
 * PureMVC does not rely upon underlying event models such as the one provided in JavaScript DOM API,
 * and TypeScript does not have an inherent event model.
 *
 * The Observer pattern as implemented within PureMVC exists to support event-driven
 * communication between the application and the actors of the MVC triad (Model, View and
 * Controller).
 *
 * Notifications are not meant to be a replacement for Events in Javascript.
 * Generally, @IMediator implementors place event listeners on their view components,
 * which they then handle in the usual way. This may lead to the broadcast of
 * @INotifications to trigger @ICommands or to communicate with other 
 * @IMediators . @IProxy and @ICommand instances communicate
 * with each other and @IMediators by broadcasting @INotifications.
 *
 * A key difference between JavaScript @Events and PureMVC
 * @INotifications is that @Events follow the 'Chain of Responsibility'
 * pattern, 'bubbling' up the display hierarchy until some parent component handles the
 * @Event, while PureMVC @INotifications follow a 'Publish/Subscribe'
 * pattern. PureMVC classes need not be related to each other in a parent/child relationship in
 * order to communicate with one another using @INotifications .
 */
export interface INotification
{
	/**
	 * Get the name of the @Notification instance.
	 * 
	 * @return
	 *		The name of the @Notification instance.
		*/
	getName(): string;

	/**
	 * Set the body of the @INotification .
	 *
	 * @param body
	 * 		The body of the notification instance.
	 */
	setBody( body:any ): void;

	/**
	 * Get the body of the @INotification .
	 * 
	 * @return
	 *		The body object of the @INotification .
		*/
	getBody(): any;

	/**
	 * Set the type of the @INotification .
	 *
	 * @param type
	 * 		The type identifier for the notification.
	 */
	setType( type:string ): void;

	/**
	 * Get the type of the @INotification .
	 * 
	 * @return
	 *		The type of the @INotification .
		*/
	getType(): string;

	/**
	 * Get a textual representation of the @Notification instance.
	 *
	 * @return
	 * 		The textual representation of the @Notification instance.
	 */
	toString(): string;
}


/** 
 * The interface definition for a PureMVC @Notifier .
 * @MacroCommand , @SimpleCommand , @Mediator and
 * @Proxy all have a need to send @Notifications .
 * 
 * The @INotifier interface provides a common method called
 * @sendNotification that relieves implementation code of the necessity to actually
 * construct @Notification s.
 *
 * The @INotifier interface, which all of the above mentioned classes extend,
 * provides an initialized reference to the @Facade singleton, which is required by
 * the convenience method @sendNotification	for sending @Notifications ,
 * but it also eases implementation as these classes have frequent @Facade
 * interactions and usually require access to the facade anyway.
 */
interface INotifier
{
    /**
     * Create and send a @Notification .
     *
     * Keeps us from having to construct new @Notification instances in our
     * implementation code.
     * 
     * @param name
     * 		The name of the notification to send.
     * 
     * @param body
     * 		The body of the notification (optional).
     *
     * @param type
     * 		The type of the notification (optional).
     */
    sendNotification( name:string, body?:any, type?:string ): void;
}


/**
 * The interface definition for a PureMVC Observer.
 *
 * In PureMVC, @IObserver implementors assumes these responsibilities: 
 * <UL>
 * <LI>Encapsulate the notification (callback) method of the interested object.
 * <LI>Encapsulate the notification context (this) of the interested object.
 * <LI>Provide methods for setting the interested object notification method and context.
 * <LI>Provide a method for notifying the interested object.
 *
 * PureMVC does not rely upon underlying event models such as the one provided in JavaScript DOM API,
 * and JavaScript does not have an inherent event model.
 *
 * The Observer Pattern as implemented within PureMVC exists to support event driven
 * communication between the application and the actors of the MVC triad (Model, View, Controller).
 *
 * An Observer is an object that encapsulates information about an interested object with a
 * notification method that should be called when an </code>INotification</code> is broadcast.
 * The Observer then acts as a proxy for notifying the interested object.
 *
 * Observers can receive @Notification s by having their @notifyObserver
 * method invoked, passing in an object implementing the @INotification interface,
 * such as a subclass of @Notification .
 */
interface IObserver
{
    /**
     * Set the notification method.
     *
     * The notification method should take one parameter of type @INotification .
     * 
     * @param notifyMethod
     * 		The notification (callback) method of the interested object.
     */
    setNotifyMethod( notifyMethod:Function ): void;
    
    /**
    /**
     * Set the notification context.
     * 
     * @param notifyContext
     * 		The notification context (this) of the interested object.
     */
    setNotifyContext( notifyContext:any ): void;
    
    /**
     * Notify the interested object.
     * 
     * @param notification
     * 		The @INotification to pass to the interested object's notification
     * 		method.
     */
    notifyObserver( notification:INotification ): void;
    
    /**
     * Compare an object to the notification context.
     *
     * @param object
     * 		The object to compare.
     *
     * @return
     * 		The object and the notification context are the same.
     */
    compareNotifyContext( object:any ): boolean;
}


/**
 * The interface definition for a PureMVC Command.
 */
interface ICommand extends INotifier
{
    /**
     * Fulfill the use-case initiated by the given @INotification .
     * 
     * In the Command Pattern, an application use-case typically begins with some user action,
     * which results in an @INotification being broadcast, which is handled by
     * business logic in the @execute method of an @ICommand .
     * 
     * @param notification
     * 		The @INotification to handle.
     */
    execute( notification:INotification ): void;
}


/**
 * The interface definition for a PureMVC Command.
 */
interface IMacroCommand
    extends ICommand
{
    initializeMacroCommand(): void;
}

/**
 * The interface definition for a PureMVC Mediator.
 *
 * In PureMVC, @IMediator implementors assume these responsibilities: 
 * <UL>
 * <LI>Implement a common method which returns a list of all @INotification s 
 * the @IMediator has interest in.
 * <LI>Implement a notification callback method.
 * <LI>Implement methods that are called when the IMediator is registered or removed from the View.
 *
 * Additionally, @IMediator s typically: 
 * <UL>
 * <LI>Act as an intermediary between one or more view components such as text boxes or 
 * list controls, maintaining references and coordinating their behavior.
 * <LI>In a PureMVC application, this the place where event listeners are added to view
 * components, and their handlers implemented.
 * <LI>Respond to and generate @INotifications , interacting with of the rest of the
 * PureMVC application.
 *
 * When an @IMediator is registered with the @IView , 
 * the @IView will call the @IMediator 's 
 * @listNotificationInterests method. The @IMediator will 
 * return a list of @INotification names which
 * it wishes to be notified about.
 *
 * The @IView will then create an @Observer object 
 * encapsulating that @IMediator 's ( @handleNotification ) method
 * and register it as an Observer for each @INotification name returned by 
 * @listNotificationInterests .
 */
interface IMediator
    extends INotifier
{
    /**
     * Get the @IMediator instance name
     * 
     * @return
     * 		The @IMediator instance name
     */
    getMediatorName(): string;
    
    /**
     * Get the @Mediator 's view component.
     *
     * Additionally, an implicit getter will usually be defined in the subclass that casts the
     * view object to a type, like this: 
     * 
     * <code>
     * getMenu: function
        *		{
        *			return this.viewComponent;
        *		}
        * </code>
        * 
        * @return
        * 		The @Mediator 's view component.
        */
    getViewComponent(): any;

    /**
     * Set the @IMediator 's view component.
     * 
     * @param viewComponent
     * 		The default view component to set for this @Mediator .
     */
    setViewComponent( viewComponent:any ): void;
    
    /**
     * List the @INotification names this @IMediator is interested in
     * being notified of.
     *
     * @return
     * 		The list of notifications names in which is interested the @Mediator .
     */
    listNotificationInterests( ): string[];
    
    /**
     * Handle @INotification s.
     * 
     *
     * Typically this will be handled in a switch statement, with one 'case' entry per
     * @INotification the @Mediator is interested in.
     *
     * @param notification
     * 		The notification instance to be handled.
     */ 
    handleNotification( notification:INotification ): void;
    
    /**
     * Called by the View when the Mediator is registered. This method has to be overridden
     * by the subclass to know when the instance is registered.
     */ 
    onRegister(): void;

    /**
     * Called by the View when the Mediator is removed. This method has to be overridden
     * by the subclass to know when the instance is removed.
     */ 
    onRemove(): void;
}


/**
 * The interface definition for a PureMVC Model.
 *
 * In PureMVC, the @IModel class provides access to model objects
 * @Proxie s by named lookup.
 *
 * The @Model assumes these responsibilities: 
 * <UL>
 * <LI>Maintain a cache of @IProxy instances.
 * <LI>Provide methods for registering, retrieving, and removing @Proxy instances.
 *
 * Your application must register @IProxy instances with the @Model .
 * Typically, you use an @ICommand to create and register @Proxy instances
 * once the @Facade has initialized the Core actors.
 */
interface IModel
{
    /**
     * Register an @IProxy with the @Model .
     * 
     * @param proxy
     *		An @IProxy to be held by the @Model .
        */
    registerProxy( proxy:IProxy ): void;

    /**
     * Remove an @IProxy from the @Model .
     *
     * @param proxyName
     *		The name of the @Proxy instance to be removed.
        *
        * @return
        *		The @IProxy that was removed from the @Model or an
        *		explicit <code>null</null> if the @IProxy didn't exist.
        */
    removeProxy( proxyName:string ): IProxy;

    /**
     * Retrieve an @IProxy from the @Model .
     * 
     * @param proxyName
     *		 The @IProxy name to retrieve from the @Model .
        *
        * @return
        *		The @IProxy instance previously registered with the given
        *		@proxyName or an explicit @null if it doesn't exists.
        */
    retrieveProxy<T extends IProxy>( proxyName:string ): T;

    /**
     * Check if a Proxy is registered
     * 
     * @param proxyName
     *		The name of the @IProxy to verify the existence of its registration.
        *
        * @return
        *		A Proxy is currently registered with the given @proxyName .
        */
    hasProxy( proxyName:string ): boolean;
}


/**
 * The interface definition for a PureMVC Proxy.
 *
 * In PureMVC, @IProxy implementors assume these responsibilities: 
 * <UL>
 * <LI>Implement a common method which returns the name of the Proxy.
 * <LI>Provide methods for setting and getting the data object.
 *
 * Additionally, @IProxy s typically: 
 * <UL>
 * <LI>Maintain references to one or more pieces of model data.
 * <LI>Provide methods for manipulating that data.
 * <LI>Generate @INotifications when their model data changes.
 * <LI>Expose their name as a @constant called @NAME , if they are not
 * instantiated multiple times.
 * <LI>Encapsulate interaction with local or remote services used to fetch and persist model
 * data.
 */
interface IProxy
    extends INotifier
{
    /**
     * Get the name of the @IProxy instance.
     *
     * @return
     * 		The name of the @IProxy instance.
     */
    getProxyName(): string;

    /**
     * Set the data of the @IProxy instance.
     *
     * @param data
     * 		The data to set for the @IProxy instance.
     */
    setData( data:any ): void;

    /**
     * Get the data of the @IProxy instance.
     *
     * @return
     * 		The data held in the @IProxy instance.
     */
    getData(): any;

    /**
     * Called by the Model when the @IProxy is registered. This method has to be
     * overridden by the subclass to know when the instance is registered.
     */
    onRegister( ): void;

    /**
     * Called by the Model when the @IProxy is removed. This method has to be
     * overridden by the subclass to know when the instance is removed.
     */
    onRemove( ): void;
}


/**
 * The interface definition for a PureMVC view.
 *
 * In PureMVC, @IView implementors assume these responsibilities: 
 *
 * In PureMVC, the @View class assumes these responsibilities: 
 * <UL>
 * <LI>Maintain a cache of @IMediator instances.
 * <LI>Provide methods for registering, retrieving, and removing @IMediator s.
 * <LI>Notifiying @IMediator s when they are registered or removed.
 * <LI>Managing the @Observer lists for each @INotification in the
 * application.
 * <LI>Providing a method for attaching @IObservers to an
 * @INotification 's @Observer list.
 * <LI>Providing a method for broadcasting an @INotification .
 * <LI>Notifying the @IObserver s of a given @INotification when it
 * broadcasts.
 */
interface IView
{
    /**
     * Register an @IObserver to be notified of @INotifications with a
     * given name.
     * 
     * @param notificationName
     * 		The name of the @INotifications to notify this @IObserver
     * 		of.
     *
     * @param observer
     * 		The @IObserver to register.
     */
    registerObserver( notificationName:string, observer:IObserver ): void;

    /**
     * Remove a list of @Observer s for a given @notifyContext from an
     * @Observer list for a given @INotification name.
     *
     * @param notificationName
     * 		Which @IObserver list to remove from.
     *
     * @param notifyContext
     * 		Remove the @IObserver with this object as its
     *		@notifyContext .
        */
    removeObserver( notificationName:string, notifyContext:any ): void;

    /**
     * Notify the @IObserver s for a particular @INotification .
     *
     * All previously attached @IObserver s for this @INotification 's
     * list are notified and are passed a reference to the @INotification in the
     * order in which they were registered.
     * 
     * @param notification
     * 		The @INotification to notify @IObserver s of.
     */
    notifyObservers( notification:INotification ): void;

    /**
     * Register an @IMediator instance with the @View .
     *
     * Registers the @IMediator so that it can be retrieved by name, and further
     * interrogates the @IMediator for its @INotification interests.
     *
     * If the @IMediator returns any @INotification names to be
     * notified about, an @Observer is created to encapsulate the
     * @IMediator instance's @handleNotification method and register
     * it as an @Observer for all @INotification s the
     * @IMediator is interested in.
     *
     * @param mediator
     * 		A reference to an @IMediator implementation instance.
     */
    registerMediator( mediator:IMediator ): void;

    /**
     * Retrieve an @IMediator from the @View .
     * 
     * @param mediatorName
     * 		The name of the @IMediator instance to retrieve.
     *
     * @return
     * 		The @IMediator instance previously registered with the given
     *		@mediatorName or an explicit @null if it doesn't exists.
        */
    retrieveMediator( mediatorName:string ): IMediator;

    /**
     * Remove an @IMediator from the @View .
     * 
     * @param mediatorName
     * 		Name of the @IMediator instance to be removed.
     *
     * @return
     *		The @IMediator that was removed from the @View or a
        *		strict <code>null</null> if the @Mediator didn't exist.
        */
    removeMediator( mediatorName:string ): IMediator;
    
    /**
     * Check if a @IMediator is registered or not.
     * 
     * @param mediatorName
     * 		The @IMediator name to check whether it is registered.
     *
     * @return
     *		A @Mediator is registered with the given @mediatorName .
        */
    hasMediator( mediatorName:string ): boolean;
}


/**
 * The interface definition for a PureMVC Controller.
 *
 * In PureMVC, an @IController implementor follows the 'Command and Controller'
 * strategy, and assumes these responsibilities: 
 * <UL>
 * <LI>Remembering which @ICommands are intended to handle which
 * @INotifications.
 * <LI>Registering itself as an @IObserver with the @View for each
 * @INotification that it has an @ICommand mapping for.
 * <LI>Creating a new instance of the proper @ICommand to handle a given
 * @INotification when notified by the @View.
 * <LI>Calling the @ICommand's @execute method, passing in the
 * @INotification.
 *
 * Your application must register @ICommands with the @Controller.
 *
 * The simplest way is to subclass </code>Facade</code>, and use its
 * @initializeController method to add your registrations.
 */
interface IController
{
    /**
     * If an @ICommand has previously been registered to handle the given
     * @INotification, then it is executed.
     * 
     * @param notification
     * 		The @INotification the command will receive as parameter.
     */
    executeCommand( notification:INotification ): void;
    
    /**
     * Register a particular @ICommand class as the handler for a particular
     * @INotification.
     *
     * If an @ICommand has already been registered to handle
     * @INotifications with this name, it is no longer used, the new
     * @ICommand is used instead.
     * 
     * The @Observer for the new @ICommand is only created if this the
     * first time an @ICommand has been registered for this
     * @Notification name.
     * 
     * @param notificationName
     * 		The name of the @INotification.
     *
     * @param commandClassRef
     * 		The constructor of the @ICommand implementor.
     */
    registerCommand( notificationName:string, commandClassRef:Function ): void;
    
    /**
     * Check if an @ICommand is registered for a given @Notification.
     * 
     * @param notificationName
     * 		Name of the @Notification to check wheter an @ICommand is
     * 		registered for.
     *
     * @return
     * 		An @ICommand is currently registered for the given
     *		@notificationName.
        */
    hasCommand( notificationName:string ): boolean;

    /**
     * Remove a previously registered @ICommand to @INotification
     * mapping.
     *
     * @param notificationName
     * 		The name of the @INotification to remove the @ICommand
     * 		mapping for.
     */
    removeCommand( notificationName:string ): void;
}


/**
 * The interface definition for a PureMVC Facade.
 *
 *
 * The Facade Pattern suggests providing a single class to act as a central point of
 * communication for a subsystem.
 * 
 *
 * In PureMVC, the Facade acts as an interface between the core MVC actors (Model, View,
 * Controller) and the rest of your application.
 */
export interface IFacade
    extends INotifier
{
    /**
     * Register an @ICommand with the @IController associating it to a
     * @INotification name.
     * 
     * @param notificationName
     *		The name of the @INotification to associate the @ICommand
        *		with.
        *
        * @param commandClassRef
        * 		A reference to the constructor of the @ICommand .
        */
    registerCommand( notificationName:string, commandClassRef:Function ): void;
    
    /**
     * Remove a previously registered @ICommand to @INotification
     * mapping from the @Controller .
     *
     * @param notificationName
     *		The name of the @INotification to remove the @ICommand
        *		mapping for.
        */
    removeCommand( notificationName:string ): void;

    /**
     * Check if an @ICommand is registered for a given @Notification .
     * 
     * @param notificationName
     * 		The name of the @INotification to verify for the existence of a
     * 		@ICommand mapping for.
     *
     * @return
     * 		A @Command is currently registered for the given
     *		@notificationName .
        */
    hasCommand( notificationName:string ): boolean;

    /**
     * Register an @IProxy with the @Model by name.
     *
     * @param proxy
     *		The @IProxy to be registered with the @Model .
        */
    registerProxy( proxy:IProxy ): void;

    /**
     * Retrieve an @IProxy from the @Model by name.
     * 
     * @param proxyName
     * 		The name of the @IProxy to be retrieved.
     *
     * @return
     * 		The @IProxy previously registered with the given @proxyName .
     */
    retrieveProxy<T extends IProxy>( proxyName:string ): T;
    
    /**
     * Remove an @IProxy from the @Model by name.
     *
     * @param proxyName
     *		The @IProxy to remove from the @Model .
        *
        * @return
        *		The @IProxy that was removed from the @Model 
        */
    removeProxy( proxyName:string ): IProxy;

    /**
     * Check if a @Proxy is registered.
     * 
     * @param proxyName
     * 		The @IProxy to verify the existence of a registration with the
     *		@IModel .
        *
        * @return
        * 		A @Proxy is currently registered with the given	@proxyName .
        */
    hasProxy( proxyName:string ): boolean;

    /**
     * Register a @IMediator with the @IView .
     *
     * @param mediator
            A reference to the @IMediator .
        */
    registerMediator( mediator:IMediator ): void;

    /**
     * Retrieve an @IMediator from the @IView .
     * 
     * @param mediatorName
     * 		The name of the registered @Mediator to retrieve.
     *
     * @return
     *		The @IMediator previously registered with the given
        *		@mediatorName .
        */
    retrieveMediator( mediatorName:string ): IMediator;

    /**
     * Remove an @IMediator from the @IView .
     * 
     * @param mediatorName
     * 		Name of the @IMediator to be removed.
     *
     * @return
     *		The @IMediator that was removed from the @IView 
        */
    removeMediator( mediatorName:string ): IMediator;
    
    /**
     * Check if a Mediator is registered or not
     * 
     * @param mediatorName
     * 		The name of the @IMediator to verify the existence of a registration
     *		for.
        *
        * @return
        * 		An @IMediator is registered with the given @mediatorName .
        */
    hasMediator( mediatorName:string ): boolean;

    /**
     * Notify the @IObservers for a particular @INotification .
     *
     * This method is left public mostly for backward compatibility, and to allow you to send
     * custom notification classes using the facade.
     *
     * Usually you should just call sendNotification and pass the parameters, never having to
     * construct the notification yourself.
     * 
     * @param notification
     * 		The @INotification to have the @IView notify
     *		@IObserver s	of.
        */
    notifyObservers( notification:INotification ): void;
}


/**
 * The @Controller class for PureMVC.
 *
 * A singleton @IController implementation.
 *
 * In PureMVC, the @Controller class follows the 'Command and Controller' strategy,
 * and assumes these responsibilities: 
 *
 * <UL>
 * <LI>Remembering which @ICommands are intended to handle which
 * @INotifications.
 * <LI>Registering itself as an @IObserver with the @View for each
 * @INotification that it has an @ICommand mapping for.
 * <LI>Creating a new instance of the proper @ICommand to handle a given
 * @INotification when notified by the @View.
 * <LI>Calling the @ICommand's @execute method, passing in the
 * @INotification.
 *
 * Your application must register @ICommands with the @Controller.
 *
 * The simplest way is to subclass </code>Facade</code>, and use its
 * @initializeController method to add your registrations.
 */
class Controller
    implements IController
{
    /**
     * Local reference to the @View singleton.
     *
     * @protected
     */		
    view:IView = null;

    /**
     * Mapping of @Notification names to @Command constructors references.
     *
     * @protected
     */		
    commandMap:Object = null;

    /**
    /**
     * Constructs a @Controller instance.
     *
     * This @IController implementation is a singleton, so you should not call the
     * constructor directly, but instead call the static singleton Factory method
     * <code>Controller.getInstance()</code>.
     * 
     * @throws Error
     * 		Throws an error if an instance for this singleton has already been constructed.
     */
    constructor()
    {
        if( Controller.instance )
            throw Error( Controller.SINGLETON_MSG );

        Controller.instance = this;
        this.commandMap     = {};
        this.initializeController();
    }

    /**
     * Initialize the singleton @Controller instance.
     * 
     * Called automatically by the constructor.
     * 
     * Note that if you are using a subclass of @View in your application, you
     * should <i>also</i> subclass @Controller and override the
     * @initializeController method in the following way: 
     * 
     * <pre>
     *		// ensure that the Controller is talking to my IView implementation
        * initializeController(): void
        *		{
        * this.view = MyView.getInstance();
        *		}
        * </pre>
        *
        * @protected
        */
    initializeController(): void
    {
        this.view = View.getInstance();
    }

    /**
     * If an @ICommand has previously been registered to handle the given
     * @INotification, then it is executed.
     * 
     * @param notification
     * 		The @INotification the command will receive as parameter.
     */
    executeCommand( notification:INotification ): void
    {
        /*
            * Typed any here instead of @Function ( won't compile if set to Function
            * because today the compiler consider that @Function is not newable and
            * doesn't have a @Class type)
            */
        var commandClassRef:any = this.commandMap[ notification.getName() ];
        if( commandClassRef )
        {
            var command:ICommand = <ICommand> /*</>*/ new commandClassRef();
            command.execute( notification );
        }

    }

    /**
     * Register a particular @ICommand class as the handler for a particular
     * @INotification.
     *
     * If an @ICommand has already been registered to handle
     * @INotifications with this name, it is no longer used, the new
     * @ICommand is used instead.
     * 
     * The @Observer for the new @ICommand is only created if this the
     * first time an @ICommand has been registered for this
     * @Notification name.
     * 
     * @param notificationName
     * 		The name of the @INotification.
     *
     * @param commandClassRef
     * 		The constructor of the @ICommand.
     */
    registerCommand( notificationName:string, commandClassRef:Function ): void
    {
        if( !this.commandMap[ notificationName ] )
            this.view.registerObserver( notificationName, new Observer( this.executeCommand, this ) );

        this.commandMap[ notificationName ] = commandClassRef;
    }
    
    /**
     * Check if an @ICommand is registered for a given @Notification.
     * 
     * @param notificationName
     * 		Name of the @Notification to check wheter an @ICommand is
     * 		registered for.
     *
     * @return
     * 		An @ICommand is currently registered for the given
     * 		@notificationName.
     */
    hasCommand( notificationName:string ): boolean
    {
        return this.commandMap[ notificationName ] ! = null;
    }

    /**
     * Remove a previously registered @ICommand to @INotification
     * mapping.
     *
     * @param notificationName
     * 		The name of the @INotification to remove the @ICommand
     * 		mapping for.
     */
    removeCommand( notificationName:string ): void
    {
        // if the Command is registered...
        if( this.hasCommand( notificationName ) )
        {
            this.view.removeObserver( notificationName, this );			
            delete this.commandMap[notificationName];
        }
    }

    /**
     * Singleton instance local reference.
     *
     * @protected
     */
    static instance: IController;

    /**
     * Error message used to indicate that a controller singleton is already constructed when
     * trying to constructs the class twice.
     *
     * @protected
     * @constant
     */
    static SINGLETON_MSG:string = "Controller singleton already constructed!";
    
    /**
     * @Controller singleton Factory method.
     * 
     * @return
     * 		The singleton instance of @Controller
     */
    static getInstance(): IController
    {
        if( !Controller.instance )
            Controller.instance = new Controller();

        return Controller.instance;
    }
}


/**
 * The @Model class for PureMVC.
 *
 * A singleton @IModel implementation.
 *
 * In PureMVC, the @IModel class provides access to model objects
 * @Proxie s by named lookup.
 *
 * The @Model assumes these responsibilities: 
 * <UL>
 * <LI>Maintain a cache of @IProxy instances.
 * <LI>Provide methods for registering, retrieving, and removing @Proxy instances.
 *
 * Your application must register @IProxy instances with the @Model .
 * Typically, you use an @ICommand to create and register @Proxy instances
 * once the @Facade has initialized the Core actors.
 */
class Model
    implements IModel
{
    /**
     * HashTable of @IProxy registered with the @Model .
     *
     * @protected
     */
    proxyMap:Object = null;

    /**
     * This @IModel implementation is a singleton, so you should not call the
     * constructor directly, but instead call the static singleton Factory method
     * <code>Model.getInstance()</code>.
     * 
     * @throws Error
     * 		Error if singleton instance has already been constructed.
     */
    constructor()
    {
        if( Model.instance )
            throw Error( Model.SINGLETON_MSG );

        Model.instance = this;
        this.proxyMap  = {};
        this.initializeModel();
    }
    
    /**
     * Initialize the singleton @Model instance.
     *
     * Called automatically by the constructor, this is the opportunity to initialize the
     * singleton instance in a subclass without overriding the constructor.
     *
     * @protected
     */
    initializeModel(): void
    {

    }

    /**
     * Register an @IProxy with the @Model .
     * 
     * @param proxy
     *		An @IProxy to be held by the @Model .
        */
    registerProxy( proxy:IProxy ): void
    {
        this.proxyMap[ proxy.getProxyName() ] = proxy;
        proxy.onRegister();
    }

    /**
     * Remove an @IProxy from the @Model .
     *
     * @param proxyName
     *		The name of the @Proxy instance to be removed.
        *
        * @return
        *		The @IProxy that was removed from the @Model or an
        *		explicit <code>null</null> if the @IProxy didn't exist.
        */
    removeProxy( proxyName:string ): IProxy
    {
        var proxy:IProxy = this.proxyMap[ proxyName ];
        if( proxy )
        {
            delete this.proxyMap[ proxyName ];
            proxy.onRemove();
        }
        
        return proxy;
    }

    /**
     * Retrieve an @IProxy from the @Model .
     * 
     * @param proxyName
     *		 The @IProxy name to retrieve from the @Model .
        *
        * @return
        *		The @IProxy instance previously registered with the given
        *		@proxyName or an explicit @null if it doesn't exists.
        */
    retrieveProxy<T extends IProxy>( proxyName:string ): T
    {
        //Return a strict null when the proxy doesn't exist
        return this.proxyMap[proxyName] || null;
    }

    /**
     * Check if a Proxy is registered
     * 
     * @param proxyName
     *		The name of the @IProxy to verify the existence of its registration.
        *
        * @return
        *		A Proxy is currently registered with the given @proxyName .
        */
    hasProxy( proxyName:string ): boolean
    {
        return this.proxyMap[ proxyName ] ! = null;
    }

    /**
     * Error message used to indicate that a controller singleton is already constructed when
     * trying to constructs the class twice.
     *
     * @constant
     * @protected
     */
        static SINGLETON_MSG:string = "Model singleton already constructed!";

    /**
     * singleton instance local reference.
     *
     * @protected
     */
        static instance: IModel;
            
    /**
     * @Model singleton factory method.
     * 
     * @return
     * 		The singleton instance of @Model .
     */
    static getInstance(): IModel
    {
        if( !Model.instance )
            Model.instance = new Model();

        return Model.instance;
    }
}


/**
 * The @View class for PureMVC.
 *
 * A singleton @IView implementation.
 *
 * In PureMVC, the @View class assumes these responsibilities: 
 * <UL>
 * <LI>Maintain a cache of @IMediator instances.
 * <LI>Provide methods for registering, retrieving, and removing @IMediators.
 * <LI>Notifiying @IMediators when they are registered or removed.
 * <LI>Managing the @Observer lists for each @INotification in the
 * application.
 * <LI>Providing a method for attaching @IObservers to an
 * @INotification's @Observer list.
 * <LI>Providing a method for broadcasting an @INotification.
 * <LI>Notifying the @IObservers of a given @INotification when it
 * broadcasts.
 */
class View
    implements IView
{
    /**
     * Mapping of @Mediator names to @Mediator instances.
     *
     * @protected
     */
    mediatorMap:Object = null;

    /**
     * Mapping of @Notification names to @Observers lists.
     *
     * @protected
     */
    observerMap:Object = null;

    /**
     * This @IView implementation is a singleton, so you should not call the
     * constructor directly, but instead call the static singleton Factory method
     * <code>View.getInstance()</code>.
     * 
     * @throws Error
     * 		Throws an error if an instance for this singleton has already been constructed.
     */
    constructor()
    {
        if( View.instance )
            throw Error( View.SINGLETON_MSG );

        View.instance    = this;
        this.mediatorMap = {};
        this.observerMap = {};
        this.initializeView();
    }
    
    /**
     * Initialize the singleton @View instance.
     * 
     * Called automatically by the constructor. This is the opportunity to initialize the
     * singleton instance in a subclass without overriding the constructor.
     */
    initializeView(): void
    {

    }

    /**
     * Register an @IObserver to be notified of @INotifications with a
     * given name.
     * 
     * @param notificationName
     * 		The name of the @INotifications to notify this @IObserver
     * 		of.
     *
     * @param observer
     * 		The @IObserver to register.
     */
    registerObserver( notificationName:string, observer:IObserver ): void
    {
        var observers:IObserver[] = this.observerMap[ notificationName ];
        if( observers )
            observers.push( observer );
        else
            this.observerMap[ notificationName ] = [ observer ];
    }

    /**
     * Remove a list of @Observers for a given @notifyContext from an
     * @Observer list for a given @INotification name.
     *
     * @param notificationName
     * 		Which @IObserver list to remove from.
     *
     * @param notifyContext
     * 		Remove the @IObserver with this object as its
     *		@notifyContext.
        */
    removeObserver( notificationName:string, notifyContext:any ): void
    {
        //The observer list for the notification under inspection
        var observers:IObserver[] = this.observerMap[ notificationName ];

        //Find the observer for the notifyContext.
        var i:number = observers.length;
        while( i-- )
        {
            var observer:IObserver = observers[i];
            if( observer.compareNotifyContext(notifyContext) )
            {
                observers.splice( i, 1 );
                break;
            }
        }

        /*
            * Also, when a Notification's Observer list length falls to zero, delete the
            * notification key from the observer map.
            */
        if( observers.length == 0 )
            delete this.observerMap[ notificationName ];
    } 

    /**
     * Notify the @IObservers for a particular @INotification.
     *
     * All previously attached @IObservers for this @INotification's
     * list are notified and are passed a reference to the @INotification in the
     * order in which they were registered.
     * 
     * @param notification
     * 		The @INotification to notify @IObservers of.
     */
    notifyObservers( notification:INotification ): void
    {
        var notificationName:string = notification.getName();

        var observersRef/*Array*/ = this.observerMap[notificationName];
        if( observersRef )
        {
            // Copy the array.
            var observers/*Array*/ = observersRef.slice(0);
            var len/*Number*/      = observers.length;
            for( var i/*Number*/=0; i<len; i++ )
            {
                var observer/*Observer*/ = observers[i];
                observer.notifyObserver(notification);
            }
        }
    }

    /**
     * Register an @IMediator instance with the @View.
     *
     * Registers the @IMediator so that it can be retrieved by name, and further
     * interrogates the @IMediator for its @INotification interests.
     *
     * If the @IMediator returns any @INotification names to be
     * notified about, an @Observer is created to encapsulate the
     * @IMediator instance's @handleNotification method and register
     * it as an @Observer for all @INotifications the
     * @IMediator is interested in.
     *
     * @param mediator
     * 		A reference to an @IMediator implementation instance.
     */
    registerMediator( mediator:IMediator ): void
    {
        var name:string = mediator.getMediatorName();

        //Do not allow re-registration (you must removeMediator first).
        if( this.mediatorMap[ name ] )
            return;

        //Register the Mediator for retrieval by name.
        this.mediatorMap[ name ] = mediator;
        
        //Get Notification interests, if any.
        var interests:string[] = mediator.listNotificationInterests();
        var len:Number         = interests.length;
        if( len>0 )
        {
            //Create Observer referencing this mediator's handlNotification method.
            var observer:IObserver = new Observer( mediator.handleNotification, mediator );

            //Register Mediator as Observer for its list of Notification interests.
            for( var i:number=0;  i<len; i++ )
                this.registerObserver( interests[i],  observer );
        }
        
        //Alert the mediator that it has been registered.
        mediator.onRegister();
    }

    /**
     * Retrieve an @IMediator from the @View.
     * 
     * @param mediatorName
     * 		The name of the @IMediator instance to retrieve.
     *
     * @return
     * 		The @IMediator instance previously registered with the given
     *		@mediatorName or an explicit @null if it doesn't exists.
        */
    retrieveMediator( mediatorName:string ): IMediator
    {
        //Return a strict null when the mediator doesn't exist
        return this.mediatorMap[ mediatorName ] || null;
    }

    /**
     * Remove an @IMediator from the @View.
     * 
     * @param mediatorName
     * 		Name of the @IMediator instance to be removed.
     *
     * @return
     *		The @IMediator that was removed from the @View or a
        *		strict <code>null</null> if the @Mediator didn't exist.
        */
    removeMediator( mediatorName:string ): IMediator
    {
        // Retrieve the named mediator
        var mediator:IMediator = this.mediatorMap[ mediatorName ];
        if( !mediator )
            return null;

        //Get Notification interests, if any.
        var interests:string[] = mediator.listNotificationInterests();

        //For every notification this mediator is interested in...
        var i:number = interests.length;
        while( i-- )
            this.removeObserver( interests[i], mediator );

        // remove the mediator from the map
        delete this.mediatorMap[ mediatorName ];

        //Alert the mediator that it has been removed
        mediator.onRemove();

        return mediator;
    }
    
    /**
     * Check if a @IMediator is registered or not.
     * 
     * @param mediatorName
     * 		The @IMediator name to check whether it is registered.
     *
     * @return
     *		A @Mediator is registered with the given @mediatorName.
        */
    hasMediator( mediatorName:string ): boolean
    {
        return this.mediatorMap[ mediatorName ] ! = null;
    }

    /**
     * @constant
     * @protected
     */
    static SINGLETON_MSG:string = "View singleton already constructed!";

    /**
     * Singleton instance local reference.
     *
     * @protected
     */
        static instance: IView;

    /**
     * @View singleton Factory method.
     * 
     * @return
     *		The singleton instance of @View.
        */
    static getInstance(): IView
    {
        if( !View.instance )
            View.instance = new View();

        return View.instance;
    }
}


/**
 * A base @INotifier implementation.
 *
 * @MacroCommand , @SimpleCommand , @Mediator and
 * @Proxy all have a need to send @Notifications .
 * 
 * The @INotifier interface provides a common method called
 * @sendNotification that relieves implementation code of the necessity to actually
 * construct @Notification s.
 *
 * The @INotifier interface, which all of the above mentioned classes extend,
 * provides an initialized reference to the @Facade singleton, which is required by
 * the convenience method @sendNotification	for sending @Notifications ,
 * but it also eases implementation as these classes have frequent @Facade
 * interactions and usually require access to the facade anyway.
 */
class Notifier
    implements INotifier
{
    /**
     * Local reference to the singleton @Facade .
     *
     * @protected
     */
    facade:IFacade = null;

    /**
     * Constructs a @Notifier instance.
     */
    constructor()
    {
        this.facade = Facade.getInstance();
    }

    /**
     * Create and send a @Notification .
     *
     * Keeps us from having to construct new @Notification instances in our
     * implementation code.
     * 
     * @param name
     * 		The name of the notification to send.
     * 
     * @param body
     * 		The body of the notification.
     *
     * @param type
     * 		The type of the notification.
     */
    sendNotification( name:string, body:any=null, type:string=null ): void
    {
        this.facade.sendNotification( name, body, type );
    }
}

/**
 * A base @ICommand implementation that executes other @ICommand s.
 *
 * A @MacroCommand maintains an list of @ICommand constructor references
 * called <i>SubCommand</i>s.
 *
 * When @execute is called, the @MacroCommand instantiates and calls
 * @execute on each of its <i>SubCommands</i> turn. Each <i>SubCommand</i> will be
 * passed a reference to the original @INotification that was passed to the
 * @MacroCommand 's @execute method.
 *
 * Unlike @SimpleCommand , your subclass should not override @execute ,
 * but instead, should override the @initializeMacroCommand method, calling
 * @addSubCommand once for each <i>SubCommand</i> to be executed.
 */
export class MacroCommand
    extends Notifier
    implements ICommand, INotifier
{
    /**
     * An array of @ICommand s.
     *
     * @protected
     */
    subCommands:Function[] = null;
    
    /**
     * Constructs a @MacroCommand instance.
     *
     * You should not need to define a constructor in your subclasses, instead, override the
     * @initializeMacroCommand method.
     *
     * If your subclass does define a constructor, be  sure to call <code>super()</code>.
     */
    constructor()
    {
        super();

        this.subCommands = [];
        this.initializeMacroCommand();
    }

    /**
     * Initialize the @MacroCommand .
     * 
     * In your subclass, override this method to  initialize the @MacroCommand 's
     * <i>SubCommand</i> list with @ICommand class references like this: 
     * 
     * <pre>
     *		// Initialize MyMacroCommand
        * initializeMacroCommand(): void
        *		{
        *			this.addSubCommand( FirstCommand );
        *			this.addSubCommand( SecondCommand );
        *			this.addSubCommand( ThirdCommand );
        *		}
        * </pre>
        * 
        * Note that <i>subCommand</i>s may be any @ICommand implementor so
        * @MacroCommand s or @SimpleCommand s are both acceptable.
        */
    initializeMacroCommand(): void
    {
    
    }

    /**
     * Add an entry to the <i>subCommands</i> list.
     * 
     * The <i>subCommands</i> will be called in First In/First Out (FIFO) order.
     * 
     * @param commandClassRef
     *		A reference to the constructor of the @ICommand .
        */
    addSubCommand( commandClassRef:Function ): void
    {
        this.subCommands.push(commandClassRef);
    }

    /** 
     * Execute this @MacroCommand 's <i>SubCommands</i>.
     *
     * The <i>SubCommands</i> will be called in First In/First Out (FIFO)
     * order. 
     * 
     * @param notification
     *		The @INotification object to be passed to each <i>SubCommand</i> of
        *		the list.
        *
        * @final
        */
    execute( notification:INotification ): void
    {
        var subCommands:Function[] = this.subCommands.slice(0);
        var len:number             = this.subCommands.length;
        for( var i:number=0; i<len; i++ )
        {
            /*
                * Typed any here instead of @Function ( won't compile if set to Function
                * because today the compiler consider that @Function is not newable and
                * doesn't have a @Class type)
                */
            var commandClassRef:any      = subCommands[i];
            var commandInstance:ICommand = <ICommand> /*</>*/ new commandClassRef();
            commandInstance.execute( notification );
        }
        
        this.subCommands.splice(0);
    }
}


/**
 * A base @ICommand implementation.
 * 
 * Your subclass should override the @execute method where your business logic will
 * handle the @INotification .
 */
export class SimpleCommand
    extends Notifier
    implements ICommand, INotifier
{
    /**
     * Fulfill the use-case initiated by the given @INotification .
     * 
     * In the Command Pattern, an application use-case typically begins with some user action,
     * which results in an @INotification being broadcast, which is handled by
     * business logic in the @execute method of an @ICommand .
     * 
     * @param notification
     * 		The @INotification to handle.
     */
    execute( notification:INotification ): void
    {

    }
}


/**
 * A base @IMediator implementation. 
 * 
 * Typically, a @Mediator will be written to serve one specific control or group
 * controls and so, will not have a need to be dynamically named.
 */
class Mediator
    extends Notifier
    implements IMediator, INotifier
{
    /**
     * The name of the @Mediator .
     *
     * @protected
     */
    mediatorName:string = null;

    /**
     * The @Mediator 's view component.
     *
     * @protected
     */
    viewComponent:any = null;

    /**
     * Constructs a @Mediator instance.
     *
     * @param mediatorName
     * 		The name of the @Mediator .
     *
     * @param viewComponent
     * 		The view component handled by this @Mediator .
     */
    constructor( mediatorName:string=null, viewComponent:any=null )
    {
        super();

        this.mediatorName  = (mediatorName != null) ? mediatorName : Mediator.NAME;
        this.viewComponent = viewComponent;
    }

    /**
     * Get the @Mediator instance name.
     *
     * @return
     * 		The @Mediator instance name
     */		
    getMediatorName(): string
    {	
        return this.mediatorName;
    }

    /**
     * Get the @Mediator 's view component.
     *
     * Additionally, an implicit getter will usually be defined in the subclass that casts the
     * view object to a type, like this: 
     * 
     * <code>
     * getMenu(): Menu
        *		{
        *			return <Menu> this.viewComponent;
        *		}
        * </code>
        * 
        * @return
        * 		The @Mediator 's default view component.
        */
    getViewComponent(): any
    {	
        return this.viewComponent;
    }

    /**
     * Set the @IMediator 's view component.
     * 
     * @param viewComponent
     * 		The default view component to set for this @Mediator .
     */
    setViewComponent( viewComponent:any ): void
    {
        this.viewComponent = viewComponent;
    }

    /**
     * List the @INotification names this @IMediator is interested in
     * being notified of.
     *
     * @return
     * 		The list of notifications names in which is interested the @Mediator .
     */
    listNotificationInterests(): string[]
    {
        return new Array<string>();
    }

    /**
     * Handle @INotification s.
     * 
     *
     * Typically this will be handled in a switch statement, with one 'case' entry per
     * @INotification the @Mediator is interested in.
     *
     * @param notification
     * 		The notification instance to be handled.
     */ 
    handleNotification( notification:INotification ): void
    {

    }

    /**
     * Called by the View when the Mediator is registered. This method has to be overridden
     * by the subclass to know when the instance is registered.
     */ 
    onRegister(): void
    {

    }

    /**
     * Called by the View when the Mediator is removed. This method has to be overridden
     * by the subclass to know when the instance is removed.
     */ 
    onRemove(): void
    {

    }

    /**
     * Default name of the @Mediator .
     *
     * @constant
     */
    static NAME:string = 'Mediator';
}


/**
 * A base @IObserver implementation.
 *
 * In PureMVC, the @Observer class assumes these responsibilities: 
 * <UL>
 * <LI>Encapsulate the notification (callback) method of the interested object.
 * <LI>Encapsulate the notification context (this) of the interested object.
 * <LI>Provide methods for setting the interested object notification method and context.
 * <LI>Provide a method for notifying the interested object.
 *
 * PureMVC does not rely upon underlying event models such as the one provided in JavaScript DOM API,
 * and TypeScript does not have an inherent event model.
 *
 * The Observer Pattern as implemented within PureMVC exists to support event driven
 * communication between the application and the actors of the MVC triad (Model, View, Controller).
 *
 * An Observer is an object that encapsulates information about an interested object with a
 * notification method that should be called when an </code>INotification</code> is broadcast.
 * The Observer then acts as a proxy for notifying the interested object.
 *
 * Observers can receive @Notification s by having their @notifyObserver
 * method invoked, passing in an object implementing the @INotification interface,
 * such as a subclass of @Notification .
 */
class Observer
    implements IObserver
{
    /**
     * The notification method of the interested object.
     * @protected
     */
    notify:Function = null;

    /**
     * The notification context of the interested object.
     * @protected
     */
    context:any = null;

    /**
     * Constructs an @Observer instance.
     * 
     * @param notifyMethod
     * 		The notification method of the interested object.
     *
     * @param notifyContext
     * 		The notification context of the interested object.
     */
    constructor( notifyMethod:Function, notifyContext:any )
    {
        this.setNotifyMethod( notifyMethod );
        this.setNotifyContext( notifyContext );
    }

    /**
     * Get the notification method.
     * 
     * @return
     * 		The notification (callback) method of the interested object.
     */
    private getNotifyMethod(): Function
    {
        return this.notify;
    }

    /**
     * Set the notification method.
     *
     * The notification method should take one parameter of type @INotification .
     * 
     * @param notifyMethod
     * 		The notification (callback) method of the interested object.
     */
    setNotifyMethod( notifyMethod:Function ): void
    {
        this.notify = notifyMethod;
    }
    
    /**
     * Get the notification context.
     * 
     * @return
     * 		The notification context (@this) of the interested object.
     */
    private getNotifyContext(): any
    {
        return this.context;
    }
        
    /**
     * Set the notification context.
     * 
     * @param notifyContext
     * 		The notification context (this) of the interested object.
     */
    setNotifyContext( notifyContext:any ): void
    {
        this.context = notifyContext;
    }

    /**
     * Notify the interested object.
     * 
     * @param notification
     * 		The @INotification to pass to the interested object's notification
     * 		method.
     */
    notifyObserver( notification:INotification ): void
    {
        this.getNotifyMethod().call( this.getNotifyContext(), notification );
    }

    /**
     * Compare an object to the notification context.
     *
     * @param object
     * 		The object to compare.
     *
     * @return
     * 		The object and the notification context are the same.
     */
    compareNotifyContext( object:any ): boolean
    {
        return object === this.context;
    }		
}

/**
 * A base @INotification implementation.
 *
 * PureMVC does not rely upon underlying event models such as the one provided in JavaScript DOM API,
 * and TypeScript does not have an inherent event model.
 * 
 * The Observer pattern as implemented within PureMVC exists to support event-driven
 * communication between the application and the actors of the MVC triad (Model, View and
 * Controller).
 *
 * Notifications are not meant to be a replacement for Events in Javascript.
 * Generally, @IMediator implementors place event listeners on their view components,
 * which they then handle in the usual way. This may lead to the broadcast of
 * @INotification s to trigger @ICommand s or to communicate with other
 * @IMediators . @IProxy and @ICommand instances communicate
 * with each other and @IMediator s by broadcasting @INotification s.
 *
 * A key difference between JavaScript @Event s and PureMVC
 * @INotification s is that @Event s follow the 'Chain of Responsibility'
 * pattern, 'bubbling' up the display hierarchy until some parent component handles the
 * @Event , while PureMVC @INotification s follow a 'Publish/Subscribe'
 * pattern. PureMVC classes need not be related to each other in a parent/child relationship in
 * order to communicate with one another using @INotification s.
 */
class Notification
    implements INotification
{
    /**
     * The name of the @Notification .
     *
     * @protected
     */
    name:string = null;

    /**
     * The body data to send with the @Notification .
     *
     * @protected
     */
    body:any = null;

    /**
     * The type identifier of the @Notification .
     *
     * @protected
     */
    type:string = null;

    /**
     * Constructs a @Notification instance.
     *
     * @param name
     * 		The name of the notification.
     *
     * @param body
     * 		Body data to send with the @Notification .
     * 
     * @param type
     * 		Type identifier of the @Notification .
     */
    constructor( name:string, body:any=null, type:string=null )
    {
        this.name = name;
        this.body = body;
        this.type = type;
    }

    /**
     * Get the name of the @Notification instance.
     * 
     * @return
     *		The name of the @Notification instance.
        */
    getName(): string
    {
        return this.name;
    }

    /**
     * Set the body of the @Notification instance.
     *
     * @param body
     * 		The body of the @Notification instance.
     */
    setBody( body:any ): void
    {
        this.body = body;
    }

    /**
     * Get the body of the @Notification instance.
     * 
     * @return
     *		The body object of the @Notification instance.
        */
    getBody(): any
    {
        return this.body;
    }

    /**
     * Set the type of the @Notification instance.
     *
     * @param type
     * 		The type of the @Notification instance.
     */
    setType( type:string ): void
    {
        this.type = type;
    }

    /**
     * Get the type of the @Notification instance.
     * 
     * @return
     *		The type of the @Notification instance.
        */
    getType(): string
    {
        return this.type;
    }

    /**
     * Get a textual representation of the @Notification instance.
     *
     * @return
     * 		The textual representation of the @Notification	instance.
     */
    toString(): string
    {
        var msg:string  = "Notification Name: " + this.getName();
            msg        += "\nBody:" + (( this.getBody() == null ) ? "null" : this.getBody().toString());
            msg        += "\nType:" + (( this.getType() == null ) ? "null" : this.getType());
        return msg;
    }		
}


/**
 * A base @IProxy implementation. 
 *
 * In PureMVC, @IProxy implementors assume these responsibilities: 
 * <UL>
 * <LI>Implement a common method which returns the name of the Proxy.
 * <LI>Provide methods for setting and getting the data object.
 *
 * Additionally, @IProxy s typically: 
 * <UL>
 * <LI>Maintain references to one or more pieces of model data.
 * <LI>Provide methods for manipulating that data.
 * <LI>Generate @INotifications when their model data changes.
 * <LI>Expose their name as a @constant called @NAME , if they are not
 * instantiated multiple times.
 * <LI>Encapsulate interaction with local or remote services used to fetch and persist model
 * data.
 */
class Proxy
    extends Notifier
    implements IProxy, INotifier
{
    /**
     * The data object controlled by the @Proxy .
     *
     * @protected
     */
    proxyName:string = null;

    /**
     * The name of the @Proxy .
     *
     * @protected
     */
    data:any = null;

    /**
     * Constructs a @Proxy instance.
     *
     * @param proxyName
     * 		The name of the @Proxy instance.
     *
     * @param data
     * 		An initial data object to be held by the @Proxy .
     */
    constructor( proxyName:string=null, data:any=null )
    {
        super();

        this.proxyName = (proxyName != null) ? proxyName : Proxy.NAME;

        if( data != null )
            this.setData(data);
    }

    /**
     * Get the name of the <code>Proxy></code> instance.
     *
     * @return
     * 		The name of the <code>Proxy></code> instance.
     */
    getProxyName(): string
    {
        return this.proxyName;
    }		

    /**
     * Set the data of the <code>Proxy></code> instance.
     *
     * @param data
     * 		The data to set for the <code>Proxy></code> instance.
     */
    setData( data:any ): void
    {
        this.data = data;
    }

    /**
     * Get the data of the <code>Proxy></code> instance.
     *
     * @return
     * 		The data held in the @Proxy instance.
     */
    getData(): any
    {
        return this.data;
    }

    /**
     * Called by the Model when the @Proxy is registered. This method has to be
     * overridden by the subclass to know when the instance is registered.
     */
    onRegister(): void
    {

    }

    /**
     * Called by the Model when the @Proxy is removed. This method has to be
     * overridden by the subclass to know when the instance is removed.
     */
    onRemove(): void
    {

    }

    /**
     * The default name of the @Proxy
     * 
     * @type
     * @constant
     */
    static NAME:string = "Proxy";
}


/**
 * A base singleton @IFacade implementation.
 * 
 * In PureMVC, the @Facade class assumes these responsibilities: 
 *
 * <UL>
 * <LI>Initializing the @Model, @View and @Controller
 * singletons.
 * <LI>Providing all the methods defined by the @IModel, @IView, &
 * @IController interfaces.
 * <LI>Providing the ability to override the specific @Model, @View and
 * @Controller singletons created.
 * <LI>Providing a single point of contact to the application for registering
 * @Commands and notifying @Observers.
 *
 * This @Facade implementation is a singleton and cannot be instantiated directly,
 * but instead calls the static singleton factory method <code>Facade.getInstance()</code>.
 */
export class Facade
    implements IFacade
{
    /**
     * Local reference to the @Model singleton.
     *
     * @protected
     */
    model:IModel = null;

    /**
     * Local reference to the @View singleton.
     *
     * @protected
     */
    view:IView = null;
            
    /**
     * Local reference to the @Controller singleton.
     *
     * @protected
     */
    controller:IController = null;

    /**
     * Constructs a @Controller instance.
     *
     * This @IFacade implementation is a singleton, so you should not call the
     * constructor directly, but instead call the static singleton Factory method
     * <code>Facade.getInstance()</code>.
     * 
     * @throws Error
     *		Throws an error if an instance of this singleton has already been constructed.
        */
    constructor()
    {
        if( Facade.instance )
            throw Error( Facade.SINGLETON_MSG );

        Facade.instance = this;
        this.initializeFacade();
    }

    /**
     * Called automatically by the constructor.
     * Initialize the singleton @Facade instance.
     *
     * Override in your subclass to do any subclass specific initializations. Be sure to
     * extend the @Facade with the methods and properties on your implementation
     * and call <code>Facade.initializeFacade()</code>.
     *
     * @protected
     */
    initializeFacade(): void
    {
        this.initializeModel();
        this.initializeController();
        this.initializeView();
    }

    /**
     * Initialize the @Model.
     * 
     * Called by the @initializeFacade method. Override this method in your
     * subclass of @Facade if one or both of the following are true: 
     *
     * <UL>
     * <LI> You wish to initialize a different @IModel.
     * <LI> You have @Proxys to register with the @Model that do not
     * retrieve a reference to the @Facade at construction time.
     *
     * If you don't want to initialize a different @IModel, call
     * <code>super.initializeModel()</code> at the beginning of your method, then register
     * @Proxys.
     *
     * Note: This method is <i>rarely</i> overridden; in practice you are more likely to use a
     * @Command to create and register @Proxys with the
     * @Model, since @Proxys with mutable data will likely need to send
     * @INotifications and thus will likely want to fetch a reference to the
     * @Facade during their construction.
     *
     * @protected
     */
    initializeModel(): void
    {
        if( !this.model )
            this.model = Model.getInstance();
    }

    /**
     * Initialize the @Controller.
     * 
     * Called by the @initializeFacade method. Override this method in your
     * subclass of @Facade if one or both of the following are true: 
     * 
     * <UL>
     * <LI>You wish to initialize a different @IController.
     * <LI>You have @ICommands to register with the @Controller at
     * startup.
     *
     * If you don't want to initialize a different @IController, call
     * <code>super.initializeController()</code> at the beginning of your method, then register
     * @Commands.
     *
     * @protected
     */
    initializeController(): void
    {
        if( !this.controller )
            this.controller = Controller.getInstance();
    }

    /**
     * Initialize the @View.
     *
     * Called by the @initializeFacade method. Override this method in your
     * subclass of @Facade if one or both of the following are true: 
     * <UL>
     * <LI> You wish to initialize a different @IView.
     * <LI> You have @Observers to register with the @View
     *
     * If you don't want to initialize a different @IView, call
     * <code>super.initializeView()</code> at the beginning of your method, then register
     * @IMediator instances.
     *
     * Note: This method is <i>rarely</i> overridden; in practice you are more likely to use a
     * @Command to create and register @Mediators with the
     * @View, since @IMediator instances will need to send 
     * @INotifications and thus will likely want to fetch a reference to the
     * @Facade during their construction. 
     *
     * @protected
     */
    initializeView(): void
    {
        if( !this.view )
            this.view = View.getInstance();
    }

    /**
     * Register an @ICommand with the @IController associating it to a
     * @INotification name.
     * 
     * @param notificationName
     *		The name of the @INotification to associate the @ICommand
     *		with.

     * @param commandClassRef
     * 		A reference to the constructor of the @ICommand.
     */
    registerCommand( notificationName:string, commandClassRef:Function ): void
    {
        this.controller.registerCommand( notificationName, commandClassRef );
    }

    /**
     * Remove a previously registered @ICommand to @INotification
     * mapping from the @Controller.
     *
     * @param notificationName
     *		The name of the @INotification to remove the @ICommand
     *		mapping for.
     */
    removeCommand( notificationName:string ): void
    {
        this.controller.removeCommand( notificationName );
    }

    /**
     * Check if an @ICommand is registered for a given @Notification.
     * 
     * @param notificationName
     * 		The name of the @INotification to verify for the existence of an
     * 		@ICommand mapping for.
     *
     * @return
     * 		A @Command is currently registered for the given
     *		@notificationName.
     */
    hasCommand( notificationName:string ): boolean
    {
        return this.controller.hasCommand(notificationName);
    }

    /**
     * Register an @IProxy with the @Model by name.
     *
     * @param proxy
     *		The @IProxy to be registered with the @Model.
     */
    registerProxy( proxy:IProxy ): void
    {
        this.model.registerProxy( proxy );
    }
            
    /**
     * Retrieve an @IProxy from the @Model by name.
     * 
     * @param proxyName
     * 		The name of the @IProxy to be retrieved.
     *
     * @return
     * 		The @IProxy previously registered with the given
     *		@proxyName.
     */
    retrieveProxy<T extends IProxy>( proxyName:string ): T
    {
        return this.model.retrieveProxy( proxyName );
    }

    /**
     * Remove an @IProxy from the @Model by name.
     *
     * @param proxyName
     *		The @IProxy to remove from the @Model.
     *
     * @return
     *		The @IProxy that was removed from the @Model
     */
    removeProxy( proxyName:string ): IProxy
    {
        var proxy: IProxy;
        if( this.model )
            proxy = this.model.removeProxy( proxyName );

        return proxy
    }

    /**
     * Check if a @Proxy is registered.
     * 
     * @param proxyName
     * 		Use the proxyName to verify the existence of a registration with the
     *		@IModel.
     *
     * @return
     * 		A @Proxy is currently registered with the given	@proxyName.
     */
    hasProxy( proxyName:string ): boolean
    {
        return this.model.hasProxy( proxyName );
    }

    /**
     * Register a @IMediator with the @IView.
     *
     * @param mediator
            A reference to the @IMediator.
        */
    registerMediator( mediator:IMediator ): void
    {
        if( this.view )
            this.view.registerMediator( mediator );
    }

    /**
     * Retrieve an @IMediator from the @IView.
     * 
     * @param mediatorName
     * 		The name of the registered @Mediator to retrieve.
     *
     * @return
     *		The @IMediator previously registered with the given
        *		@mediatorName.
        */
    retrieveMediator( mediatorName:string ): IMediator
    {
        return this.view.retrieveMediator( mediatorName );
    }

    /**
     * Remove an @IMediator from the @IView.
     * 
     * @param mediatorName
     * 		Name of the @IMediator to be removed.
     *
     * @return
     *		The @IMediator that was removed from the @IView
        */
    removeMediator( mediatorName:string ): IMediator
    {
        var mediator: IMediator;
        if( this.view )
            mediator = this.view.removeMediator( mediatorName );

        return mediator;
    }

    /**
     * Check if a @Mediator is registered or not
     * 
     * @param mediatorName
     * 		The name of the @IMediator to verify the existence of a registration
     *		for.
        *
        * @return
        * 		An @IMediator is registered with the given @mediatorName.
        */
    hasMediator( mediatorName:string ): boolean
    {
        return this.view.hasMediator( mediatorName );
    }

    /**
     * Notify the @IObservers for a particular @INotification.
     *
     * This method is left public mostly for backward compatibility, and to allow you to
     * send custom notification classes using the @Facade .
     *
     *
     * Usually you should just call @sendNotification and pass the parameters,
     * never having to construct the @INotification yourself.
     * 
     * @param notification
     * 		The @INotification to have the @IView notify
     *		@IObservers	of.
        */
    notifyObservers ( notification:INotification ): void
    {
        if( this.view )
            this.view.notifyObservers( notification );
    }

    /**
     * Create and send an @INotification.
     * 
     * Keeps us from having to construct new notification instances in our implementation code.
     *
     * @param name
     *		The name of the notification to send.
        *
        * @param body
        *		The body of the notification to send.
        *
        * @param type
        *		The type of the notification to send.
        */
    sendNotification( name:string, body:any=null, type:string=null ): void
    {
        this.notifyObservers( new Notification( name, body, type ) );
    }

    /**
     * @constant
     * @protected
     */
    static SINGLETON_MSG:string = "Facade singleton already constructed!";

    /**
     * The singleton @Facade instance.
     *
     * @protected
     */
    static instance: IFacade;

    /**
     * Facade singleton factory method.
     * 
     * @return
     * 		The singleton instance of @Facade.
     */
    static getInstance(): IFacade
    {
        if( !Facade.instance )
            Facade.instance = new Facade();

        return Facade.instance;
    }
}

/*********************************************************
 * 扩展到 Creator 引擎
 */

 interface ITComponent {
    listNotificationInterests()                            : string[];
    handleNotification       ( notification:INotification ): void;
 }

 interface ITMediator {
     onLoad();
     onDestroy();
 }

 class TMediator extends Mediator implements ITMediator {
    private static _mediator_id: number = 0;
    constructor(viewComponent: Component )
    {
        ++TMediator._mediator_id;
        let mediatorName:string = "Mediator_" + TMediator._mediator_id
        super(mediatorName, viewComponent);
    }

    onLoad() {
        this.facade.registerMediator(this);
    }
    
    onDestroy() {
        this.facade.removeMediator(this.getMediatorName());
    }

    onRegister(){

    }

    onRemove(){

    }

    listNotificationInterests(): string[]{
        let viewComponent = this.getViewComponent()
        return viewComponent.listNotificationInterests();
    }

    handleNotification( notification:INotification ): void
    {
        let viewComponent = this.getViewComponent();
        return viewComponent.handleNotification(notification);
    }
 }

const {ccclass, property} = cc._decorator;

@ccclass
export class Component extends cc.Component implements ITComponent{
    facade : IFacade             = null;
    private mediator_: TMediator = null;
    constructor(){
        super();
        this.facade    = Facade.getInstance();
        this.mediator_ = new TMediator(this);
    }
    onLoad(){
        this.mediator_.onLoad();
        this.__onLoad();
    }
    /**
     * @__onLoad __onLoad == onLoad;
     */
    __onLoad()
    {

    }

    onEnable()
    {
        this.__onEnable();
    }
    /**
     * @__onEnable __onEnable == onEnable;
     */
    __onEnable()
    {

    }
    start()
    {
        this.__start();
    }
    /**
     * @__start __start == start;
     */
    __start()
    {

    }
    lateUpdate()
    {
        this.__lateUpdate();
    }
    /**
     * @__lateUpdate __lateUpdate == lateUpdate;
     */
    __lateUpdate()
    {
        
    }

    update(dt)
    {
        this.__update(dt);
    }
    /**
     * @__update --> __update == update;
     */
    __update(dt)
    {

    }

    onDisable()
    {
        this.__onDisable();
    }
    /**
     * @__onDisable __onDisable == onDisable;
     */
    __onDisable()
    {

    }

    onDestroy(){
        this.mediator_.onDestroy();
        this.__onDestroy();
    }
    /**
     * @__onDestroy __onDestroy == onDestroy;
     */
    __onDestroy()
    {

    }

    listNotificationInterests(): string[]{
        return []
    }

    handleNotification( notification:INotification ):void{
        // 通常由子类实现
    }
}

/*********************************************************
 * 数据部分
 * 
 */
export class TProxy extends Proxy {
    constructor(proxyName:string, data:any=null){
        data = (data != null) ? data : {}
        super( proxyName,  data)
    }
}

}
