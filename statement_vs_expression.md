# Statement vs Expression

A good example of the difference between a statement and an expression is "if".  In C++ if is a statement so you can write code like this:

```
if ( x == 5 ) {
  std::cout << "this is the number 5" << std::endl;
} else {
  std::cout << "this is not the number 5" << std::endl;
}
```

but Rust defines if as an expression, which means it will return a value.  We could still write code like the above, but it allows to 
extend also write code like this:

```
let y = if ( x == 5 ) {
    5
  } else {
    6
  };
```

In general, you can use expressions as statements, but you cannot use statements as expressions because statements do not evaluate to a value.  Expressions used as statements have their values discarded by the compiler as they are not used.
  
