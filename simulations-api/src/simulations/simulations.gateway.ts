import { MessageBody, SubscribeMessage, WebSocketGateway, WsResponse } from '@nestjs/websockets';
import { SimulationsService } from './simulations.service';
import { SimulationId, SimulationsDto } from './simulations.dto';
import { Observable } from 'rxjs';

@WebSocketGateway({
  namespace: '/simulation',
  cors: { origin: [/localhost:\d{4}/, /127\.0\.0\.1:\d{4}/, /simulations-api:\d{4}/, /\.malski\.pl$/] },
  maxHttpBufferSize: 1e7
})
export class SimulationsGateway {
  constructor(private simulationsService: SimulationsService) {}

  @SubscribeMessage('start')
  async start(@MessageBody() data: SimulationsDto): Promise<Observable<WsResponse>> {
    return this.simulationsService.start(data);
  }

  @SubscribeMessage('stop')
  stop(@MessageBody() data: SimulationId) {
    this.simulationsService.stop(data.id);
  }
}
