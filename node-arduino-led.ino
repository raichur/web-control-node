int outPin = 13;

void setup()
{
  pinMode(outPin, OUTPUT);
  Serial.begin(9600);
}

void loop()
{
  if(Serial.available() > 0){
    int incomingByte = Serial.read();
    if(incomingByte == 0x01){
      digitalWrite(outPin, HIGH);
    } else if(incomingByte == 0x00){
      digitalWrite(outPin, LOW);
    }
  }  
}
