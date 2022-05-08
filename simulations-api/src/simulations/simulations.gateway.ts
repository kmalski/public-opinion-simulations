import { MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { SimulationsService } from './simulations.service';
import { SimulationId, SimulationDto } from './simulations.dto';
import { Observable } from 'rxjs';
import { CORS } from '../config';
import { Incoming } from './simulations.events';

@WebSocketGateway({
  namespace: '/simulation',
  cors: { origin: CORS.origin },
  maxHttpBufferSize: 1e7
})
export class SimulationsGateway {
  constructor(private simulationsService: SimulationsService) {}

  @SubscribeMessage(Incoming.START)
  async start(@MessageBody() data: SimulationDto): Promise<Observable<WsResponse>> {
    return this.simulationsService.start(data);
  }

  @SubscribeMessage(Incoming.STOP)
  stop(@MessageBody() data: SimulationId) {
    this.simulationsService.stop(data.id);
  }
}
